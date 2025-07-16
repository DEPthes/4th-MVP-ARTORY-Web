import Button from "../components/Button/Button";
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1>HomePage</h1>
      <div className="flex gap-2 mt-10">
        <Button size="sm">Test 버튼</Button>
        <Button variant="secondary">Second </Button>
        <Button loading>로딩하는 버튼</Button>
      </div>
    </div>
  );
};

export default HomePage;
