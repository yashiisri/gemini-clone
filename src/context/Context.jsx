import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context=createContext();

const ContextProvider=(props)=>{
    const[input,setInput]=useState("");
    const[recentPrompt,setRecentPrompt]=useState("");
    const [previousPrompts,setPreviousPrompts]=useState([]);
    const[showResult,setShowResult]=useState(false);
    const [loading,setLoading]=useState(false);
    const [resultData,setResultData]=useState("");

    const delayPara=(index,nextWord)=>{
        setTimeout(function(){
           setResultData(previousPrompts=>previousPrompts+nextWord);
        },75*index)

    }

    const newChat=()=>{
        setLoading(false)
        setShowResult(false)

    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt!==undefined){
         response=await run(prompt);
         setRecentPrompt(prompt)
        }else{
            setPreviousPrompts(previousPrompts=>[...previousPrompts,input])
            setRecentPrompt(input)
            response =await run(input)
        }
    
    
        try {
            
            let responseArray = response.split("**");
            let newResponse = "";
    
            for (let i = 0; i < responseArray.length; i++) {
                if (i % 2 === 1) {
                    // Make every part between ** bold
                    newResponse += "<b>" + responseArray[i] + "</b>";
                } else {
                    // Append other parts as they are
                    newResponse += responseArray[i];
                }
            }
            let newResponse2=newResponse.split("*").join("</br>")
    
            let newResponseArray=newResponse2.split(" ");
            for(let i=0;i<newResponseArray.length;i++){
                const nextWord=newResponseArray[i];
                delayPara(i,nextWord +" ")
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    
        setLoading(false);
        setInput("");
    };
    
    
   
    const contextValue={
        previousPrompts,
        setPreviousPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat

    };
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider