const handle = async ({ event, resolve }) => {
  const response = await resolve(event, {
    filterSerializedResponseHeaders: () => true
  });
  return response;
};

export { handle };
//# sourceMappingURL=hooks.server-017b622f.js.map
