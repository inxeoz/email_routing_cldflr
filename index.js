export default {
  async fetch(request, env, ctx) {
    return new Response("Email worker is running ✅", { status: 200 });
  },

  async email(message, env, ctx) {
    try {
      const recipient = message.to.toLowerCase();

      let forwardTo = await env.email_routing.get(recipient);

      if (!forwardTo) {
        forwardTo = await env.email_routing.get("default");
      }

      if (!forwardTo) {
        console.log(`No forwarding found and no default set for: ${recipient}`);
        return;
      }

      console.log(`Forwarding ${recipient} -> ${forwardTo}`);
      await message.forward(forwardTo);

    } catch (err) {
      console.error("Email worker error:", err);
    }
  }
}
