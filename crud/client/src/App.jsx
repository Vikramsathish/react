import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setFilterusers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setuserData] = useState({ name: "", age:"", city:"" });

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then
    ((res) => {
      setUsers(res.data);
      setFilterusers(res.data);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSearchChange = (e)=>{
    const searchText=e.target.value.toLowerCase();
    const filteredUsers=users.filter((user)=>user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText));
    setFilterusers(filteredUsers);
  };

  const handleDelete = async (id)=>{
    const isConfirmed = window.confirm("are you sure");
    if(isConfirmed){
      await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
        setUsers(res.data);
        setFilterusers(res.data);
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddRecord = () =>{
    setuserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  };

  const handleData = (e) => {
    setuserData({...userData,[e.target.name]: e.target.value});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(userData.id){
      await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then((res) => {
        console.log(res);
      });
    }else{
      await axios.post("http://localhost:8000/users",userData).then((res) => {
        console.log(res);
      });
    }
    closeModal();
    setuserData({ name: "", age: "", city: "" });
    getAllUsers();
  };
  
  const handleUpdateRecord = (user) => {
    setuserData(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className='container'>       
        <h3>CRUD Application</h3>
        <div className='input-search'>
          <input type="search" placeholder="Search text here" onChange={handleSearchChange} style="height: 40px;width: 260px;border-radius: 6px;"/>
          <button onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterusers && 
            filterusers.map((user,index) => {
              return(
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td><button onClick={() => handleUpdateRecord(user)}>edit</button></td>
                  <td><button onClick={() => handleDelete(user.id)}>Delete</button></td>
                </tr>
              );
            })}
            
          </tbody>
        </table>
        {isModalOpen && <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{userData.id ? "Update User" : "Add Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" value={userData.name} name="name" id="name" onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="name">Age</label>
                <input type="number" value={userData.age} name="age" id="age" onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="name">City</label>
                <input type="text" value={userData.city} name="city" id="city" onChange={handleData}/>
              </div>
              <br />
              <button onClick={handleSubmit}>{userData.id ? "Update User" : "Add User"}</button>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default App
