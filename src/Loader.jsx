const Loader = () => {
  return (
    <div className="loader">
      <div class="content">
        <div class="loader-circle"></div>
        <div class="loader-line-mask">
          <div class="loader-line"></div>
        </div>
        <span>Loading</span>
      </div>
    </div>
  );
};

export default Loader;
