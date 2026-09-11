// Public ownership token: its security comes from serving it on our own hosts.
export const indexNowKey = "7515130a027efb4813a91ff4482c0886";
export const productUrls = ["https://puremac.yashashwi.me/", "https://puremac.yashashwi.me/fadeo", "https://arras.yashashwi.me/"];
export function changedProductUrls(files) {
  const urls = new Set();
  for (const file of files) {
    if (/^(data\/mac-products|app\/puremac\/(faq-data|faq-section|release-highlight)|app\/layout|app\/globals|proxy\.|next.config|lib\/github-release)/.test(file)) productUrls.forEach(url => urls.add(url));
    else if (/^(app\/puremac\/arras|public\/puremac\/arras)/.test(file)) { urls.add(productUrls[2]); urls.add(productUrls[0]); }
    else if (/^(app\/puremac\/fadeo|public\/puremac\/fadeo)/.test(file) && !/\/(privacy|terms|diagnostics|legal-page)/.test(file)) { urls.add(productUrls[1]); urls.add(productUrls[0]); }
    else if (/^app\/puremac\/(page|puremac-client|puremac.css|icon|llms.txt)/.test(file) || /^public\/puremac\/mark/.test(file)) urls.add(productUrls[0]);
  }
  return [...urls];
}
