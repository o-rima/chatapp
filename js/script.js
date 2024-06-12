// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


//Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const dbRef = ref(database, "chat");


///オブジェクトの練習
// const kosuge ={
//   name:'こすげ',
//   age:41,
//   from:'神奈川',
// };
// console.log(kosuge.name);
// console.log(kosuge['from']);

//  ★★★＋ボタンを押したときの処理★★★

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('plus').addEventListener('click', function(event) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'block';

    //  ツールチップの幅と高さの半分を取得
    const tooltipWidth = tooltip.offsetWidth / 2;
    const tooltipHeight = tooltip.offsetHeight / 2;

    //  ツールチップの中心がクリック位置になるように設定
    tooltip.style.left = (event.clientX - tooltipWidth) + 'px';
    tooltip.style.top = (event.clientY - tooltipHeight) + 'px';
  });

    //  他の場所をクリックしたら非表示
    document.addEventListener('click', function(event) {
    const tooltip = document.getElementById('tooltip');
    if (!event.target.matches('#plus')) {
      tooltip.style.display = 'none';
    }
  });
});

//  ★★★スタンプボタンを押したときの処理★★★

//  ※jQueryの準備ができたら実行※
$(document).ready(function() {
  const $emojiPicker = $('#emojiPicker');

    $('#stamp').click(function(event) {
      const offset = $(this).offset();
      $emojiPicker.css({
        top: offset.top + $(this).outerHeight(),
        left: offset.left
      }).toggle();
    });

    //  絵文字をクリックしたときの処理
    $emojiPicker.on('click', 'span', function() {
      const emoji = $(this).text();
      const $userName = $('#userName');
      $userName.val($userName.val() + emoji);
        //$emojiPicker.hide(); ※クリックしたらピッカーを非表示
    });

    //  ピッカー以外をクリックしたらピッカーを非表示
    $(document).click(function(event) {
      if (!$(event.target).closest('#stamp, #emojiPicker').length) {
        $emojiPicker.hide();
      }
    });
});

//  ★★★送信ボタンを押したときの処理★★★

$('#send').on('click', function(){
  //  入力欄のデータを取得
  const userName = $('#userName').val();
  if (userName.trim() !== '') {
    $('#userName').val(''); //入力フィールドをクリア
  }

  //  送信データをオブジェクトにまとめる
  const message = {
    userName: userName,
  };

  //  Firebase Realtime Datebaseにオブジェクトを送信
  const newPostRef = push(dbRef);
  set(newPostRef, message);
});

  //  指定された場所にデータが追加されたことを検知
  onChildAdded(dbRef, function(data){

  //追加されたデータをFirebaseから受け取り、分解
  const message =data.val();
  const key =data.key;
  //console.log(data, message, key);

  let chatMsg = ` 
    <div class="chatmessage">
      <div>${message.userName}</div>
    </div>
    `;
    $('#output').append(chatMsg);
  });

  //  ★★★送信ボタンを押したらスクロールを固定する★★★
  document.getElementById('send').addEventListener('click', function() {

    //  chat-areaクラスの要素を取得
    const chatArea = document.querySelector('.chat-area');

    //  スクロールを最下部に設定
    chatArea.scrollTop = chatArea.scrollHeight;
  });
