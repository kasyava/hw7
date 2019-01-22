
let lastDate='';
let globalArray = [];

let msgList, errorMsg, author, textMessage;
let squarespaceModal;
let baseURL;


$(function(){
    baseURL = location.href;

    msgList = $('#msgList');
    errorMsg = $('#errorMsg');
    author = $('#author');
    textMessage = $('#textMessage');
    squarespaceModal = $("#squarespaceModal");


    $("#showForm").click((e)=>{
        e.preventDefault();
        squarespaceModal.modal('show');
    });

    squarespaceModal.on('hidden.bs.modal', function() {
        $(this).find("input,textarea,select").val('').end();

    });

    $('#btnSendMessage').click((e) => {
        e.preventDefault();
        squarespaceModal.modal('hide');

        const data = new FormData(document.getElementById("formData"));
        console.log(data);
        sendAjax("POST", data)
            .then((responce) =>{
                errorMsg.empty();
            });
    });

    sendAjax().then(responce => fillArray(responce));

    setInterval(()=>{
        sendAjax("GET",'datetime='+lastDate).then(responce => fillArray(responce));
    },2000);
});


let fillArray = (data) =>{
    if(data.length) {
        for (let i = 0; i < data.length; i++) {
            if(!data[i].author) data[i].author = 'Anonymous';
            globalArray.push(data[i]);
        }
        lastDate = globalArray[globalArray.length-1].datetime;
    }
    printMessage(globalArray);
};


let printMessage = (data) =>{

    let list = "";
    data.forEach((element) => {
        let myDate = element.datetime.split('T')[0];
        let myTime = element.datetime.split('T')[1].split('.')[0];

        list+='<div class="col">';
        list+='<div class="message-author">'+ "Author:" + element.author + " " + "&nbsp;Date: " + myDate + "&nbsp;Time: "+ myTime;
        list+='</div>';
        if(element.image)
        {
            list += '<div class="message-image"> <img height="150" src="http://127.0.0.1:8000/uploads/' + element.image + '" alt="">';
            list += '</div>';
        }
        list+='<div class="message-text">' + element.message + '</div>';
        list+='</div>';
    });

    msgList.empty();
    msgList.html(list);
};

let sendAjax=(type='GET', data='')=> {
    console.log(window.location.href);
    return $.ajax(
        {
            url: baseURL + 'messages',
            type: type,
            data: data,
            processData: false,
            contentType: false,

            error: function(err) {
                errorMsg.html(err.responseJSON.error);
            }
        }
    );
};