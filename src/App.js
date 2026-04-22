import Chat, { Bubble, useMessages } from '@chatui/core';
import '@chatui/core/dist/index.css';

const App = () => {
  const { messages, appendMsg, setTyping } = useMessages([]);

  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      //setTyping(true);

      setTimeout(() => {
        appendMsg({
          type: 'text',
          content: { text: 'سلام عشقم' },
        });
      }, 1000);
    }
  }

  function renderMessageContent(msg) {
    const { content } = msg;
    return <Bubble content={content.text} />;
  }

  return (
    <Chat
      navbar={{ title: 'به  ربات هوش مصنوعی خوش آمدید' }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
      placeholder= {'پیام خود را بنویسید...'}
    />
  );
};

export default App;