export default (error: unknown, from: string): void => {
  console.error('\n'.repeat(2));
  console.error(`❌ Start ERROR from ${from}`);
  console.error(error);
  console.error(`❌ End ERROR from ${from}`);
  console.error('\n'.repeat(2));
};
