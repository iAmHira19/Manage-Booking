const Data = (props) => {
  return (
    <div
      className="flex flex-col items-center text-center space-y-4"
      style={{ fontFamily: "Gotham" }}
    >
      <div className="text-blue-900 text-5xl md:text-6xl">{props.Icon}</div>
      <div className="px-4">
        <div
          className="text-3xl md:text-4xl font-medium"
          style={{ fontFamily: "Gotham" }}
        >
          {props.Title}
        </div>
        <div
          className="text-lg text-gray-500"
          style={{ fontFamily: "Gotham", fontWeight: 300 }}
        >
          {props.Content}
        </div>
      </div>
    </div>
  );
};

export default Data;
