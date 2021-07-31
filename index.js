async function selectCountry(e){
    console.log(e)
    var country=document.getElementById(`${e}`).value;
    var res=await getCountryInfo(country)
    console.log(res)
    if(res.status==200){
        var {name,flag,currencies}=res;
        var img=document.getElementById(`${e}_flag`)
        img.src=flag
        document.getElementById(`${e}_name`).innerText=name;
        currencies.forEach((currency)=>{
            console.log("CUrr",currency)
            var option=document.createElement('input')
            option.setAttribute("type","radio")
            option.setAttribute("name",`select_${e}`);
            option.setAttribute("id",`${currency.code}`)
            option.setAttribute("value",`${currency.symbol}`)
            var label=document.createElement('label');
            label.setAttribute('for',currency.code)
            label.innerText=currency.name
            document.getElementById(`${e}_data`).appendChild(option);
            document.getElementById(`${e}_data`).appendChild(label);
        })

    }
    

}
async function getConversionRate(){
    var base=document.querySelector('input[name="select_base_country"]:checked');
    var target=document.querySelector('input[name="select_target_country"]:checked');
    if( base ==undefined || target==undefined){
        alert("Select Currency code of both")
        return -1
    }
    var rate=await getRateList(base.id,target.id)
    let text= `1 ${base.value} equals ${rate.rate} ${target.value}`
    console.log(text)
    document.getElementById("result").innerText=text
    document.getElementById("reset_button").style.display="block"
    
}
function getCountryInfo(country){
    var prom=new Promise((resolve,reject)=>{
        fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
        .then(res=>res.json())
        .then((res)=>{
            console.log(res)
            resolve({"status":"200",name:res[0].name,flag:res[0].flag,currencies:res[0].currencies})
        }).catch(err=>{
            reject({"status":"404",err})
        })
    })
    return prom;
}

function getRateList(curr_code,target_code){
    console.log("Curr code",curr_code,target_code)
    var r=new Promise((resolve,reject)=>{
        fetch(`https://v6.exchangerate-api.com/v6/59296ea22ad495a72a5cd51a/latest/${curr_code}`)
        .then(res=>res.json())
        .then(res=>{
            resolve({"status":"200","rate":res.conversion_rates[`${target_code}`]})
        }).catch(err=>{
            console.log("err in get rate list",err)
            reject({"status":"404"})
        })
    })
    return r;
}

function reset(){
    window.location.reload()
}