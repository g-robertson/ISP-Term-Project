export const onClientEntry = () => {
    window.onload = () => { document.getElementById("curDate").getElementsByTagName("p")[0].textContent = window.location.pathname.substring(1) }
}