/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

const initIfrm = () => {
    setInterval(() => {
        //resizeIframe();
    }, 1000);
};

const resizeIframe = () => {
    const ifrm = document.getElementById('plugin-manager');

    if (ifrm) {
        setIframeHeight(ifrm);
    }
};

const setIframeHeight = (ifrm) => {
    var doc = ifrm.contentDocument? ifrm.contentDocument:
    ifrm.contentWindow.document;

    var RestHeight=ifrm.style.height;
    ifrm.style.visibility = "hidden";
    ifrm.style.height = "10px";
    var NewHeight = getDocHeight( doc ) + 10;

    if (NewHeight>20){
        ifrm.style.height=NewHeight + "px";
    } else {
        ifrm.style.height=RestHeight + "px";
    }

    ifrm.style.visibility = "visible";
};

const getDocHeight = (doc) => {
	if (!doc) return 0;
	
	var body = doc.body, html = doc.documentElement;
    
    var height = Math.min( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    return height;
};

initIfrm();
