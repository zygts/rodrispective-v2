export function GroupRotationManager({ children }) {
  const group = useRef();
  const [rotation, setRotation] = useState(0);

  useFrame(({ mouse }) => {
    const [x] = mouse;
    setRotation((rotation) => (rotation - x) / 100);
  });

  useFrame(() => {
    group.current.rotation.y = lerp(group.current.rotation.y, rotation, 0.1);
  });

  return <group ref={group}>{children}</group>;
}
