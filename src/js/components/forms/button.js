const Button = {
    button: `<button id="myBtn">Press Me!</button>`,
    eventTrigger: () => {
        document.getElementById("myBtn").addEventListener("click",()=>{
            console.log("Pressed...");
        })
    }
};

export default Button;