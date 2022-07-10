import styled, { keyframes } from 'styled-components/macro';
import { useEffect, useState, useContext } from 'react';
import UserContext from '../../userContext';
import firebaseStores from '../../firebase';
import MessageModal from '../../components/BaseModal';

const Wrapper = styled.div`
    background: url(/img/155.jpg) no-repeat 0 bottom / cover ;
    width:100vw;
    height:100vh;
`;

const Control = styled.div`
 position: absolute;
 bottom: ${(props) => props.bottom || 0}px;
 left: ${(props) => props.left || 0}px;
  ${'' /* display: flex;
  flex-direction: column;
  justify-content: center; */}
  ${'' /* border: 1px solid black; */}

  :hover div{
    opacity: 0.8;
    background:white;
  }
`;

const Message = styled.div`
opacity: 0;
font-size:16px;
border-radius: 10px;
text-align:center ;
padding:10px 20px;
margin-bottom: 20px;
box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);

:hover{
    opacity: 0.85;
    background:white;
}
`;

const shake = keyframes`
  0%   {transform: rotate(10deg);}
  50% {transform: rotate(0deg);}
  100% {transform: rotate(10deg);}
`;

const Grass = styled.img`
 display:block; 
 margin:auto;
 height: ${(props) => props.height || 65}px;
 width:auto;
 animation: ${shake} 3s ease 0s alternate infinite;
 transform-origin: bottom center;

 :hover{
    transform: scale(1.2);
    cursor: pointer;

}
`;

const Flower = styled.img`
 display:block; 
 margin:auto;
 height: ${(props) => props.height || 100}px;
 width:auto;
 animation: ${shake} 4s linear 0s alternate infinite;
 transform-origin: bottom center;

 :hover{
    transform: scale(1.2);
    cursor: pointer;

}
`;

// const Apple = styled.img`
//  position: absolute;
//  bottom: ${(props) => props.bottom || 230}px;
//  right: ${(props) => props.left || 0}px;
//  width:200px;
//  height:300px;
//  ${'' /* Y:230,530
//  X:0,200 */}
//  ${'' /* background:white; */}
// `;

const Articles = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    margin:1rem;
    padding:1.5rem;
    font-size:14px;
    ${'' /* border: black 1px dotted; */}
    background: #EDE8D6;
    background: linear-gradient(130deg, #D7FFFE, #ace0f9, #ace0c1);

    span{
      font-size: 1.2rem;
      font-weight: bold;
      color: #683F39;
      margin-bottom: 1rem;
    }

    p{
      text-align: justify;
      line-height: 1.2rem;
    }
`;

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function getRound(x, y, r) {
//     let x2 = x * x;
//     let y2 = y * y;
//     let newRound = r * r * 3.14;
//     if (x2 * y2 <= newRound) {
//       return `x=${x} , y=${y}`;
//     }else{
//         getRound(x, y, r);
//     }
//   }
//   getRound(getRandom(0, 10), getRandom(0, 10), 25);

export default function Truf() {
  const User = useContext(UserContext);
  const [worriesArticles, setWorriesArticles] = useState([]);
  const [cheerfulArticles, setCheerfulArticles] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');

  const openModal = () => {
    setShowMessageModal((prev) => !prev);
  };

  useEffect(() => {
    if (User) {
      firebaseStores.getArticles('cheerful_articles', User.uid)
        .then((res) => setCheerfulArticles(res));
      firebaseStores.getArticles('worries_articles', User.uid)
        .then((res) => setWorriesArticles(res));
    } else {
      alert('請登入以解鎖更多互動功能~');
    }
  }, [User]);

  return (
    <Wrapper>
      {worriesArticles?.map((item) => (
        <Control bottom={getRandom(0, 100)} left={getRandom(0, 1400)}>
          <Message>{item.title}</Message>
          <Grass
            src="/img/singleGrass.png"
            height={getRandom(65, 120)}
            onClick={() => {
              setArticleTitle(item.title);
              setArticleContent(item.content);
              openModal();
            }}
          />
        </Control>
      ))}
      {cheerfulArticles?.map((item) => (
        <Control bottom={getRandom(0, 100)} left={getRandom(0, 1400)}>
          <Message>{item.title}</Message>
          <Flower
            src="/img/flower.png"
            height={getRandom(65, 100)}
            onClick={() => {
              setArticleTitle(item.title);
              setArticleContent(item.content);
              openModal();
            }}
          />
        </Control>
      ))}
      <MessageModal
        showModal={showMessageModal}
        setShowModal={setShowMessageModal}
        content={(
          <Articles>
            <span>{articleTitle}</span>
            <p>{articleContent}</p>
          </Articles>
        )}
        bkc="rgba(0, 0, 0, 0)"
        width="400px"
        height="auto"
      />
    </Wrapper>
  );
}
