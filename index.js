export default {
  async email(message, env, ctx) {
    try {
      // Normalize recipient address
      const recipient = message.to.toLowerCase();

      // Look up forwarding target in KV
      let forwardTo = await env.email_routing.get(recipient);

      // Fallback to default if no match
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
