addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with respective variant
 * @param {Request} request
 */
async function handleRequest(request) {

  var respToSendText;
  var respFin;
  var cookieURL;
  var URLSelected;
  let testResp = new Response();
  const CNAME = 'variant'
  const cookie = request.headers.get('cookie');
  if (cookie && (cookie.indexOf('Variant-1') > -1)) {
    console.log('Cookie = ', cookie);
    let cookieArr = cookie.split(',');
    cookieURL = cookieArr[1];
    URLSelected = cookieArr[0];
    console.log('Cokiee URL = ', cookieURL)
    console.log('Variant Selected = ', URLSelected)
  }
  else if (cookie && (cookie.indexOf('Variant-2') > -1)) {
    console.log('Cookie = ', cookie);
    let cookieArr = cookie.split(',');
    cookieURL = cookieArr[1];
    URLSelected = cookieArr[0];
    console.log('Cokiee URL = ', cookieURL)
    console.log('Variant Selected = ', URLSelected)
  } 
  else {
    console.log('This is a new client..');

    // if no cookie then this is a new client, decide a group and set the cookie
    let urlToFetch = 'https://cfw-takehome.developers.workers.dev/api/variants';
    // respToSendText = GetVariantResponse(urlToFetch, 'Y');

    return (GetVariantResponseCookie(urlToFetch, 'Y'))
  }

  //--------------------------------------Normal w/o Cookie------------------------


  let urlToFinallyFetch = cookieURL;
  console.log('Selected URL to Fetch = ', urlToFinallyFetch);

  let newResp = await fetch(urlToFinallyFetch);
  let finalResp = await newResp.text();

  const new_header = '<title>Ayushi`s Variant : ' + URLSelected + '</title>';
  const new_desc = 'Hello Cloudy! This is Ayushi`s custom description for ' + URLSelected;
  const new_url = 'https://www.linkedin.com/in/purohitayushi';
  var new_url_display_text = 'Connect with me here!';
  const new_title = 'Interned - Ayushi : ' + URLSelected;

  class HeaderRewriter {
    element(element) {
      element.replace(new_header, { html: true });
    }
  }
  class URLRewriter {
    constructor(attributeName) {
      this.attributeName = attributeName
    }
    element(element) {
      const attribute = element.getAttribute(this.attributeName)
      if (attribute) {
        element.setAttribute(
          this.attributeName,
          new_url
        )
      }
    }
  }
  class ContentWriter {
    element(element) {
      let finText = element.tagName == 'p' ? new_desc : element.tagName == 'h1' ? new_title : element.tagName == 'a' ? new_url_display_text : 'No new text';
      element.setInnerContent(finText, { html: true });
    }
  }
  const rewriter = new HTMLRewriter()
    .on('title', new HeaderRewriter())
    .on('p#description', new ContentWriter())
    .on('h1#title', new ContentWriter())
    .on('a#url', new URLRewriter('href'))
    .on('a#url', new ContentWriter())

    return rewriter.transform(new Response(finalResp, {
      headers: { 'content-type': 'text/html'},
    }))
}

async function GetVariantResponseCookie(url, cookie) {

  const CNAME = 'variant'
  var testResp = new Response();

  let urlToFetch = url;

  let response = await fetch(urlToFetch);
  let parsedData = await response.json();

  let variants = parsedData['variants'];
  console.log('Parsed data =', variants);

  let urlToFinallyFetch = Math.random() < 0.5 ? variants[0] : variants[1];
  console.log('Selected URL to Fetch = ', urlToFinallyFetch);

  let newResp = await fetch(urlToFinallyFetch);
  let finalResp = await newResp.text();
  URLSelected = urlToFinallyFetch == variants[0] ? 'Variant-1' : 'Variant-2';

  let group = urlToFinallyFetch == variants[0] ? ('Variant-1,' + variants[0]) : ('Variant-2,' + variants[1]);

  console.log('Group = ', group);

  // const new_header = '<title>Ayushi`s Variant : ' + URLSelected + '</title>';
  const new_header = '<title>Ayushi`s Variant</title>';
  // const new_header_title = 'Ayushi`s Variant : ' + URLSelected + '';
  const new_header_title = 'Ayushi`s Variant';
  // const new_desc = 'Hello Cloudy! This is Ayushi`s custom description for ' + URLSelected;
  const new_desc = 'Hello Cloudy! This is Ayushi`s custom description';
  const new_url = 'https://www.linkedin.com/in/purohitayushi';
  var new_url_display_text = 'Connect with me here!';
  // const new_title = 'Interned - Ayushi : ' + URLSelected;
  const new_title = 'Interned - Ayushi Purohit';

  class HeaderRewriter {
    element(element) {
      element.replace(new_header, { html: true });
    }
  }
  class URLRewriter {
    constructor(attributeName) {
      this.attributeName = attributeName
    }
    element(element) {
      const attribute = element.getAttribute(this.attributeName)
      if (attribute) {
        element.setAttribute(
          this.attributeName,
          new_url
        )
      }
    }
  }
  class ContentWriter {
    element(element) {
      let finText = element.tagName == 'p' ? new_desc : element.tagName == 'h1' ? new_title : element.tagName == 'a' ? new_url_display_text : 'No new text';
      element.setInnerContent(finText, { html: true });
    }
  }
  const rewriter = new HTMLRewriter()
    .on('title', new HeaderRewriter())
    .on('p#description', new ContentWriter())
    .on('h1#title', new ContentWriter())
    .on('a#url', new URLRewriter('href'))
    .on('a#url', new ContentWriter())

  // testResp.body = finalResp;
  // console.log('Body = ', finalResp);

  return rewriter.transform(new Response(finalResp, {
    headers: { 'content-type': 'text/html', 'Set-Cookie': `${group}; path=/` }
    // headers: { 'content-type': 'text/plain', 'Set-Cookie': `${CNAME}=${group}; path=/` },
  }))
}
