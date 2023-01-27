import { useEffect, useState, useCallback, useRef } from "react";
import {
  SendMessage,
  SubscribeToMessage,
  UnsubscribeFromMessage,
  GetInitialContext,
  IPortalSubscription,
} from "js-miniapp-bridge";
import { MESSAGE_TOPICS } from "./constants";

import "./App.css";

function App() {
  const tokenSubscriptionRef = useRef<IPortalSubscription>();
  const initialContext = GetInitialContext<{ data: string }>();

  const [message, setMessage] = useState("");

  const [subscribeToTokenSuccessResponse, setSubscribeToTokenSuccessResponse] =
    useState<Partial<IPortalSubscription>>({});
  const [subscribeToTokenErrorResponse, setsubscribeToTokenErrorResponse] =
    useState<any>(null);
  const [context, setContext] = useState(initialContext);

  const handlePublishToken = async () => {
    SendMessage({
      topic: MESSAGE_TOPICS.ACCOUNT_TOKEN,
      data: message,
    });
  };

  const subscribeToTokenCallback = (result: { topic: string; data: any }) => {
    setSubscribeToTokenSuccessResponse(result);
  };

  const subscribeToToken = useCallback(async () => {
    try {
      tokenSubscriptionRef.current = await SubscribeToMessage(
        { topic: MESSAGE_TOPICS.CHAT_MESSAGE },
        subscribeToTokenCallback
      );
    } catch (e) {
      setsubscribeToTokenErrorResponse(e);
    }
  }, []);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    subscribeToToken();

    return () => {
      UnsubscribeFromMessage(tokenSubscriptionRef.current!);
    };
  }, [subscribeToToken]);

  useEffect(() => {
    setContext(initialContext);
  }, [initialContext]);

  return (
    <div className="App">
      <div className="results-container">
        <div>
          <b>Subscribe Token Success Result:</b>
          <pre>{JSON.stringify(subscribeToTokenSuccessResponse, null, 4)}</pre>
        </div>
        <hr />
        <div>
          <b>Subscribe Token Error Result:</b>
          <pre>{JSON.stringify(subscribeToTokenErrorResponse, null, 4)}</pre>
        </div>
        <hr />
        <div>
          <b>Initial Context Result:</b>
          <pre>{JSON.stringify(context, null, 4)}</pre>
        </div>
        <hr />
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <div style={{ marginBottom: "5px" }}>
            <b>Message to send:</b>
          </div>
          <div>
            <input value={message} onChange={handleChangeInput} />
          </div>
        </div>
      </div>
      <div className="actions-container">
        <div>
          <button onClick={() => handlePublishToken()}>
            Publish/Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
