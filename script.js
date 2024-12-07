document.addEventListener('DOMContentLoaded', function () {
  const sendButton = document.getElementById('sendButton');
  const messageInput = document.getElementById('messageInput');
  const chatMessages = document.getElementById('chatMessages');
  const moodValueSpan = document.getElementById('moodValue');

  function generateUserId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let userId = '';
    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      userId += characters[randomIndex];
    }
    return userId;
  }

  const userId = generateUserId();
  console.log('userId', userId);

  avatar = 'img/boss_0.png'
  saldAvatar = 'img/boss_1.png'

  function switchThenBackAvatar(newAvatar) {
    const avatarElement = document.getElementById('avatar');
    originalAvatar = avatarElement.src;
    avatarElement.src = newAvatar;
    setTimeout(function () {
      avatarElement.src = originalAvatar;
    }, 2000);
  }

  function addMessage(messageText, isInnerThought = false) {
    const messageDiv = document.createElement('div');
    if (isInnerThought) {
      messageDiv.classList.add('message', 'inner-thought');
    } else {
      messageDiv.classList.add('message', 'other');
    }
    messageDiv.textContent = messageText;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getWordByScore(score) {
    let word;
    if (score > 10) {
      score = 10;
    } else if (score < -10) {
      score = -10;
    }
    switch (score) {
      case 10:
        word = "欣喜若狂";
        break;
      case 9:
        word = "愉悦开怀";
        break;
      case 8:
        word = "怡然自乐";
        break;
      case 7:
        word = "快意舒畅";
        break;
      case 6:
        word = "安然平和";
        break;
      case 5:
        word = "心静如水";
        break;
      case 4:
        word = "漠然无感";
        break;
      case 3:
        word = "郁郁寡欢";
        break;
      case 2:
        word = "悲痛哀伤";
        break;
      case 1:
        word = "痛苦不堪";
        break;
      case 0:
        word = "毫无波澜";
        break;
      case -1:
        word = "忧思烦闷";
        break;
      case -2:
        word = "黯然神伤";
        break;
      case -3:
        word = "伤心悲切";
        break;
      case -4:
        word = "痛心疾首";
        break;
      case -5:
        word = "愁绪满怀";
        break;
      case -6:
        word = "悲苦难耐";
        break;
      case -7:
        word = "凄然泪下";
        break;
      case -8:
        word = "惨然心碎";
        break;
      case -9:
        word = "哀痛断肠";
        break;
      case -10:
        word = "绝望悲绝";
        break;
    }
    return word;
  }

  // 初始背景
  addMessage("公司聚餐，你刚坐下，领导头都没抬", true);
  addMessage("小王，你还没有资格坐在我的旁边！！", false);


  function request(userInput) {
    const data = {
      "user_id": userId,
      "user_input": userInput
    };
    const jsonData = JSON.stringify(data);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    };

    fetch('https://heart-bag-zyhcpcitel.cn-hangzhou.fcapp.run/chat', options)
      .then(response => response.json())
      .then(result => {
        console.log('请求成功，返回结果：', result);
        if (result.score <= 0) {
          // 游戏结束
          if (confirm("算你狠！！！")) {
            // 刷新页面
            location.reload();
          }
        }
        let currentMood = parseInt(moodValueSpan.textContent);
        score = result.score - currentMood
        // 添加内心独白
        addMessage(getWordByScore(score), true);
        if (score < 0) {
          // 切换头像
          switchThenBackAvatar(saldAvatar);
        }
        // 更新分数
        updateMoodValue(result.score);
        // 添加回复
        addMessage(result.bot_return, false);
      })
      .catch(error => {
        console.error('请求出现错误：', error);
      });
  }

  // 模拟分数更新函数，这里简单示例每发送一次消息情绪值加10，你可根据实际需求调整逻辑
  function updateMoodValue(targetMood) {
    let currentMood = parseInt(moodValueSpan.textContent);
    const updateStep = (targetMood - currentMood) / 10;

    const intervalId = setInterval(() => {
      currentMood += updateStep;
      moodValueSpan.textContent = Math.round(currentMood);
      if (currentMood == targetMood) {
        clearInterval(intervalId);
      }
    }, 50);
  }

  messageInput.addEventListener('keydown', function (e) {
    if (e.key === "Enter") {
      sendButton.click();
    }
  });

  sendButton.addEventListener('click', function () {
    const messageText = messageInput.value.trim();
    if (messageText !== '') {
      // 创建自己发送消息的元素
      const selfMessageDiv = document.createElement('div');
      selfMessageDiv.classList.add('message', 'self');
      selfMessageDiv.textContent = messageText;
      chatMessages.appendChild(selfMessageDiv);

      request(messageText);
      messageInput.value = '';
    }
  });
});