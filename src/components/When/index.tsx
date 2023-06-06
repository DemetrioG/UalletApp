const When = ({ children, is }: { children: JSX.Element; is: boolean }) => {
  return is ? children : <></>;
};

export default When;
