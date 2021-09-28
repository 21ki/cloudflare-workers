const OPT = {
    botid : 'botxxxxx:xxxx',//bot id
    chatid:'xxxx',//chatid
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    // msg text
    let text = "empty_text";

    if (request.method === "POST") {
        const ret = await readRequestBody(request);
        text = ret || text;
        // const requestString = JSON.stringify(requestObject);
        //console.log(params)
    } else if (request.method === "GET") {
        let url = new URL(request.url);
        text = url.searchParams.get('text') || text;
    }

    console.log(text)
    // https://api.telegram.org/botXXXXXX/sendMessage?chat_id=YYYYYY&text=#NEZHA#
    //发送消息
    return fetch("https://api.telegram.org/"+OPT.botid+"/sendMessage?chat_id="+OPT.chatid+"&text="+text,{
        method:'get'
    });
}


/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
    const { headers } = request;
    const contentType = headers.get("content-type") || ""
    console.log(contentType);

    if (contentType.includes("application/json")) {
        console.log(1);
        let params = await request.json();
        console.log(params);
        return params['text'];
        //return JSON.stringify(await request.json())
    }
    else if (contentType.includes("application/text") || contentType.includes("text/html")|| contentType.includes("application/x-www-form-urlencoded")) {
        console.log(2);
        //console.log(typeof(await request.text()));
        let params = new URLSearchParams(await request.text());
        return params.get('text');
        //return await request.text()
    }
    else if (contentType.includes("form")) {
        console.log(4);
        const formData = await request.formData()
        const params = {}
        for (const entry of formData.entries()) {
            params[entry[0]] = entry[1]
        }
        return params.get('text');
        //return JSON.stringify(body)
    } else return "";
}