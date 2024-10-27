// function that fetches dummy post data form jsonplaceholder
export const getTabData = async (key: string): Promise<string> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${key}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const { title } = await res.json();
  return title;
};
