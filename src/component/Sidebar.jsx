import React, { useEffect, useState } from 'react'
import { db } from '../config/firebase'
import { collection, onSnapshot, query, where} from 'firebase/firestore'

const Sidebar = ({roomId}) => {
  const [members, setMembers] = useState([]);
  useEffect(()=>{
     if(!roomId) return;
     const sql = query(collection(db, "mchat"), where("roomId", "==", roomId));
     const unsubscribe = onSnapshot(sql, (rs) => {
        const membersData = [];
        rs.forEach((doc)=>{
            membersData.push({...doc.data(), id: doc.id});
        });
        setMembers(membersData);
     });
     return ()=>unsubscribe();
  }, [roomId]);
  console.log(members);
  return (
    <div className="sidebar position-absolute bg-white shadow p-5">
        <ul>
        {members.map((mem)=>(
            <li key={mem.id} className="flex align-items-center my-2 py-2 border-bottom">
                <img src={mem.uicon} className="uicon me-2" />
                {mem.nick} 님.  
            </li>
        ))}
        </ul>
    </div>
  )
}

export default Sidebar