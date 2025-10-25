import IngredientInput from "../components/IngredientInput";
import ChatBotBox from "../components/ChatBotBox";
import Suggestions from "../components/Suggestions";

export default function Plan() {
  const onChat = (msg) => {
    // later: send to backend/LLM; for now just log
    console.log("chat:", msg);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Your Weekly Plan</h1>

      <section className="space-y-2">
        <h2 className="font-semibold">Add Ingredients</h2>
        <IngredientInput />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Chatbot</h2>
        <ChatBotBox onSend={onChat} />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Suggestions</h2>
        <Suggestions />
      </section>
    </div>
  );
}
