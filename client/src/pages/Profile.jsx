import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [ file, setFile ] = useState(undefined);
  const [ filePercentage, setFilePercentage ] = useState(0);
  const [ fileUploadErr, setFileUploadErr] = useState(false);
  const [ formData, setFormData ] = useState({});
  const [ updateSuccess, setUpdateSuccess ] = useState(false);
  const dispatch = useDispatch();

  useEffect( ()=> {
    if(file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error)=> {
        setFileUploadErr(true);
      },

      ()=> {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
          setFormData({...formData, avatar: downloadURL})
        );
      }
  );
};

const handleChange= (e) => {
  setFormData({...formData, [e.target.id]: e.target.value})
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success === false){
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
  } catch (error) {
    dispatch(updateUserFailure(error.message));
  }
}

const handleDeleteUser = async () => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`,{
      method: 'DELETE',
    });
    const data = await res.json();
    if(data.success === false){
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
}

const handleSignOut = async () => {
  try {
    dispatch(signOutUserStart());
    const res = await fetch('/api/auth/signout');
    const data = await res.json();
    if(data.success === false){
      dispatch(signOutUserFailure(data.message));
      return;
    }
    dispatch(signOutUserSuccess(data));
  } catch (error) {
    dispatch(signOutUserFailure(error.message));
  }
}

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-5'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" onChange={(e)=> setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
        <img onClick={()=> fileRef.current.click()} src={formData.avatar || currentUser.avatar} 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
          alt="profile" />

        <p className='text-sm self-center'>
          {fileUploadErr ? (<span className='text-red-500'>Error Image upload(image must be less than 2mb)</span>)
            : filePercentage > 0 && filePercentage < 100 ? (<span className='text-slate-700'>{`Uploading...${filePercentage}%`}</span>)
            : filePercentage === 100 ? (<span className='text-green-700'>Image Successfully Uploaded!</span>)
            : (<span className='text-slate-700'>Tap to upload new profile picture</span>)
          }
        </p>

          <input 
          type="text" 
          placeholder='username'
          onChange={handleChange} 
          defaultValue={currentUser.username} 
          className='border p-3 rounded-lg' 
          id='username' />

          <input 
          type="email" 
          placeholder='email' 
          onChange={handleChange}
          defaultValue={currentUser.email} 
          className='border p-3 rounded-lg' 
          id='email' />

          <input 
          type="password" 
          placeholder='password'
          onChange={handleChange} 
          className='border p-3 rounded-lg' 
          id='password' />

          <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Update'}
          </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-500 cursor-pointer'>Delete Account</span> 
        <span onClick={handleSignOut} className='text-red-500 cursor-pointer'>Sign out</span> 
      </div>
          <p className='text-red-700 mt-5'>{error ? error : ''}</p>
          <p className='text-green-500 mt-1'>{updateSuccess ? 'User is updated successfully!' : ''}</p>
    </div>
  )
}
