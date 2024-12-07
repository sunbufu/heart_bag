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
        // 模拟添加别人回复的消息（两种情况，普通回复和内心活动回复）
        let currentMood = parseInt(moodValueSpan.textContent);
        score = result.score - currentMood
        addMessage(getWordByScore(score), true);
        updateMoodValue(result.score);
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