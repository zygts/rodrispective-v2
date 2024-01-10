const Loader = () => {
  return (
    <div className="loader">
      <div className="content">
        <div className="loader-circle"></div>
        <div className="loader-line-mask">
          <div className="loader-line"></div>
        </div>
        <span>Loading</span>
      </div>
    </div>
  );
};

export default Loader;
