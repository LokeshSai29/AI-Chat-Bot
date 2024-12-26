const sideNavigation = document.querySelector(".sideNavigation"),
    sideBarToggle = document.querySelector(".fa-bars"),
    startContentUl = document.querySelector(".startContent ul"),
    inputArea = document.querySelector(".inputArea input"),
    sendRequest = document.querySelector(".fa-arrow-turn-up"),
    chatHistory = document.querySelector(".chatHistory ul"),
    startContent = document.querySelector(".startContent"),
    chatContent = document.querySelector(".chatContent"),
    results = document.querySelector(".results");

    promptQuestions =[
        {
            question: "Help me write a birthday message for my best friend.",
            icon: "fa-solid fa-gift",
        },
        {
            question: "Provide a recipe for a quick and healthy breakfast.",
            icon: "fa-solid fa-utensils",
        },
        {
            question: "Explain the basics of object-oriented programming.",
            icon: "fa-solid fa-code",
        },
        {
            question: "What are some good habits for mental well-being?",
            icon: "fa-solid fa-heart",
        },

    ];

    window.addEventListener("load", () => {
        promptQuestions.forEach(data => {
            let item = document.createElement("li");
            item.addEventListener("click",()=>{
                getGeminiResponse(data.question , true);
            });
            item.innerHTML = `<div class="promptSuggestion">
            <p>${data.question}</p>
            <div class="icon"><i class="${data.icon}"></i></div>
            </div>`;

            startContentUl.append(item);
        });
    });

    sideBarToggle.addEventListener("click", ()=>{
        sideNavigation.classList.toggle("expandClose");
    })

    inputArea.addEventListener("keyup", (e) =>{
        if(e.target.value.length>0){
            sendRequest.style.display="inline";
        }else{
            sendRequest.style.display="none";
        }
    });

    sendRequest.addEventListener("click",()=>{
        getGeminiResponse(inputArea.value , true);
    })

    function getGeminiResponse(question , appendHistory){
        console.log(question);
        if(appendHistory){
        let historyLi =document.createElement("li");
        historyLi.addEventListener("click", ()=> {
            getGeminiResponse(question , false);
        });
        historyLi.innerHTML =`<i class="fa-regular fa-message"></i>${question}`;
        chatHistory.append(historyLi);
    }

        results.innerHTML="";
        inputArea.value="";

        startContent.style.display="none";
        chatContent.style.display="block";

        let resultTitle= `
        <div class="resultTitle">
        <img src="https://img.freepik.com/premium-photo/fun-unique-cartoon-profile-picture-that-represents-your-style-personality_1283595-14000.jpg" />
        <p>${question}</p>
        </div>
        `;

        let resultData =`
        <div class="resultData">
            <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"/>
            <div class="loader">
                <div class="animatedBG"></div>
                <div class="animatedBG"></div>
                <div class="animatedBG"></div>
            </div>
        </div>
        `;
        results.innerHTML+= resultTitle;
        results.innerHTML+=resultData;

        const AIURL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCiW8eOJ22VfPPNTEob8gaFm2Cpiub-l-M`
        fetch(AIURL ,{
            method:"POST",
            body : JSON.stringify({
                "contents": [{"parts":[{"text": question}]}],
            })
        }).then((response)=> response.json()).then((data)=>{
            document.querySelector(".results .resultData").remove();

            let responseData =jsonEscape(data.candidates[0].content.parts[0].text);
            console.log(responseData);

            let responseArray = responseData.split("**");
            let newResponse ="";
            for (let i = 0; i < responseArray.length; i++) {
                if(i==0 || i%2!==1){
                    newResponse+=responseArray[i];
                }else{
                    newResponse+=
                    "<strong>"+
                    responseArray[i].split(" ").join("&nbsp")+
                    "</strong>"
                }    
            }

            let newResponse2 =newResponse.split("*").join(" ");
            let textArea =document.createElement("textarea");
            textArea.innerHTML= newResponse2;


            results.innerHTML += `
            <div class="resultResponse">
            <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"/>
            <p id="typeEffect"></p>
            </div>
            `;

            let newResponseData =newResponse2.split(" ");
            for (let j = 0; j < newResponseData.length; j++) {
                timeOut(j , newResponseData[j]+" ");

            }
        });
    }

    const timeOut= (index,nextWord) =>{
        setTimeout(function(){
            document.getElementById("typeEffect").innerHTML+= nextWord;
        }, 75 * index)
    }

    function newChat() {
        startContent.style.display="block";
        chatContent.style.display="none";
    }

    function jsonEscape(str) {
        return str.replace(new RegExp("\r?\n\n", "g"), "<br>").
        replace(new RegExp("\r?\n", "g"), "<br>");
    }