import React, {useState, useEffect} from 'react'
import { useNavigate, Link} from 'react-router-dom'
import { useAuthValue } from '../context/AuthProvider'
import { db, auth } from '../config/firebase'
import { addDoc, 
         collection, 
         query, 
         orderBy, 
         onSnapshot, 
         where,
         serverTimestamp, 
         deleteDoc,
         getDocs,
         doc,
         setDoc
      } from 'firebase/firestore';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth'

const ChatLobby = () => {
  const [roomname, setRoomname] = useState("");
  const [roomList, setRoomList] = useState([]);
  const { nick, userIcon, email } = useAuthValue();
  const nav = useNavigate();
  const user = auth.currentUser;  //로그인한 사용자 정보

  /*
  onAuthStateChanged( auth , user => { 
     const userRef = doc(db, "activeUsers", user.uid);
     if(user){ //로그인 상태 - activeUser에다 로그인된 회원정보를 등록  
       setDoc(userRef, {
           uid: user.uid,
           email: user.email,
           nick: user.displayName,
           uicon: user.photoURL,
           lastLogin: new Date()
       }, { merge: true})
       .catch(error=> console.error("에러가 발생했습니다.", error));
     }else{  //로그아웃 상태 또는 삭제 - activeUser에 등록된 정보를 삭제
        deleteDoc(userRef)
       .catch(error=> console.error("에러가 발생했습니다.", error));
     }
  });
  */
 
  const logout = () => {
     signOut(auth)
       .then(()=>{
          nav("/login");
       })
       .catch((err) => console.error('로그아웃하다가 삑사리', err));
  }

  //방장이름이 null값인 경우 채팅방을 삭제
  const handleDelRoom = async() => {
     try{
        const dbref = collection(db, "chatroom");
        const sql = query(dbref, where("master", "==", null));
        const querySnapshot = await getDocs(sql);
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);  //루프를 돌며 master가 null인 채팅룸 삭제
        });
     }catch(error){
        console.error("에러가 발생했습니다.", error);
     }  
  }

  //db의 chatroom에서 읽기
  const getRoom = () => {
     const sql = query(collection(db, 'chatroom'), orderBy("timestamp", "desc"));
     onSnapshot(sql, (res) => {
        const rooms =res.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setRoomList(rooms);
     });
  }
 
  useEffect(()=>{
     handleDelRoom();
     getRoom();
  }, []);

  //db의 chatroom이라는 테이블에 쓰기
  const handleMakeRoom = async (e) => {
     e.preventDefault();
     const dbref = collection(db, 'chatroom');
        await addDoc(dbref, {
           timestamp: serverTimestamp(),
           title: roomname,
           master: nick,
           email
        });
        setRoomname("");
  }

  return (
    <div className="container">
       <div className="header text-center mt-5 pt-3">
           <img src={userIcon} alt={nick} className="usericon"/>
           <h3 className="text-center mt-4"><strong>{nick}</strong>님 환영합니다.</h3>
           <button type="button" onClick={logout} className="btn btn-warning mt-3">로그아웃</button>
       </div>
       <form className="makechat my-5" method="post" onSubmit={handleMakeRoom}>
           <h2 className="text-center">채팅방개설</h2>
           <input 
               type="text"
               placeholder="채팅룸이름을 쓰세요"
               name="roomname"
               value={roomname}
               onChange={(e)=>setRoomname(e.target.value)}
           />
           <button type="submit"
                   className="btn btn-primary"
            >채팅방만들기</button>           
       </form>
       <div className="row">
           {
              (roomList) && 
                 roomList.map((rs, index)=>(
                    <div className="chatroom col-3" key={index}>
                       <Link to={`/chat/${rs.id}`}>{rs.title}</Link>
                       <p>(방장 : {rs.master}님)</p>
                    </div>  
                 ))
           }
       </div>
    </div>
  )
}

export default ChatLobby