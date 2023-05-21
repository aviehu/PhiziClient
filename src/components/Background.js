import image from "../HomeImage.png"

function Background() {
  return (
    <div style={{ 
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            BackgroundPosition: 'fixed',
            backgroundSize: "cover",
            position: 'fixed',
            height: '100%',
            width: '100%',
            top: "-0.0001%",
            
        }}>
    </div>
  );
}

export { Background };