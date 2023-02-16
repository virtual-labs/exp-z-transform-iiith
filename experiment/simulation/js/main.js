// ------------------------------------------- Global Declarations ------------------------------------------

var k;
var p;
var sigChoice;
var scaleChoice;
var delayChoice;
var boxChoice;
var yValues;
var inValues;
var numberofsignals = 0;
var uniquenumberofsignals = 0;
var numberofsignals1 = 0;
var uniquenumberofsignals1 = 0;
var always;
var ROCNum;
var ROCNum1;
var ROCNumS;
var poles = [];
var poles1 = [];
var num = [];
var den = [];
var stable = 0;
var causal = 0;
var filterChoice;

// -------------------------------------------- Open Tabs ----------------------------------------------------

function openPart(evt, name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
}

// --------------------------------------- Add dynamic boxes --------------------------------------------------

function add_field()
{
    if(uniquenumberofsignals>=10)
    {
        return;
    }
    numberofsignals += 1;
    uniquenumberofsignals += 1;
  document.getElementById("field_div").innerHTML=document.getElementById("field_div").innerHTML+
  "<p id='input_num"+numberofsignals+"_wrapper'><input type='text' class='input_text' id='ROC_"+numberofsignals+"' placeholder='[R1 , R2]'></p>";
}
function remove_field(id1)
{
    uniquenumberofsignals -= 1;
    const element = document.getElementById(id1+"_wrapper");
    element.remove();
}

// ---------------------------------------------- FFT --------------------------------------------------------------

function fourier(waveform){
    var N = waveform.length;
    var ft = [];
    
    for(var k=0; k<N; k++)
    {
        var sum = math.complex(0,0);
        for(var n=0; n<N; n++)
        {
            sum = math.add(sum,(math.multiply(waveform[n],math.complex(Math.cos(2*Math.PI*k*n/N),-Math.sin(2*Math.PI*k*n/N)))));
        }
        if(math.re(sum)<1e-10)
        {
            var sum1 = math.complex(0,math.im(sum));
            sum = sum1;
        }
        if(math.im(sum)<1e-10)
        {
            var sum1 = math.complex(math.re(sum),0);
            sum = sum1;
        }
        ft.push(sum);
    }
    return ft;
}

function invFourier(waveform){
    var N = waveform.length;
    var ft = [];
    
    for(var k=0; k<N; k++)
    {
        var sum = math.complex(0,0);
        for(var n=0; n<N; n++)
        {
            sum = math.add(sum,math.complex(math.re(waveform[n])*Math.cos(2*Math.PI*k*n/N)/N - math.im(waveform[n])*Math.sin(2*Math.PI*k*n/N)/N,math.re(waveform[n])*Math.sin(2*Math.PI*k*n/N)/N + math.im(waveform[n])*Math.cos(2*Math.PI*k*n/N)/N));
        }
        if(math.re(sum)<1e-10)
        {
            var sum1 = math.complex(0,math.im(sum));
            sum = sum1;
        }
        if(math.im(sum)<1e-10)
        {
            var sum1 = math.complex(math.re(sum),0);
            sum = sum1;
        }
        ft.push(sum);
    }
    return ft;
}

function shift(signal){
    var N = signal.length;
    var cut = parseInt(N/2);
    var out = [];
    for(var i=cut+1; i<N; i++)
    {
        out.push(signal[i]);
    }
    for(var i=0; i<=cut; i++)
    {
        out.push(signal[i]);
    }
    return out;
}

// ----------------------------------- Pole Zero ---------------------------------------------

function poleZeroInit(){
    
    var a = document.getElementById("fillSec11").value;
    a = parseFloat(a);
    var b = document.getElementById("fillSec12").value;
    b = parseFloat(b);
    var c = document.getElementById("fillSec13").value;
    c = parseFloat(c);
    var d = document.getElementById("fillSec14").value;
    d = parseFloat(d);
    var e = document.getElementById("fillSec15").value;
    e = parseFloat(e);
    var f = document.getElementById("fillSec16").value;
    f = parseFloat(f);

    var numerator = [];
    var denominator = [];
    if(a!=d && a!=e && a!=f)
    {
        numerator.push(a);
    }
    if(b!=d && b!=e && b!=f)
    {
        numerator.push(b);
    }
    if(c!=d && c!=e && c!=f)
    {
        numerator.push(c);
    }
    if(d!=a && d!=b && d!=c)
    {
        denominator.push(d);
    }
    if(e!=a && e!=b && e!=c)
    {
        denominator.push(e);
    }
    if(f!=a && f!=b && f!=c)
    {
        denominator.push(f);
    }

    var ln = numerator.length;
    var xn = [], xd = [];
    var ld = denominator.length;

    var len = 100;
    var w = [], plty = [], pltn = [], pltd = [];
    w = makeArr(-math.PI,math.PI,len);

    // Numerator Calculation

    if(ln==0)
    {
        for(var i=0; i<len; i++)
        {
            pltn.push(1);
        }
    }
    else if(ln==1)
    {
        var a1 = numerator[0];
        for(var i=0; i<len; i++)
        {
            pltn.push(-2*a1*math.cos(w[i]) + a1*a1 + 1);
        }
    }
    else if(ln==2)
    {
        var a1 = numerator[0];
        var b1 = numerator[1];
        for(var i=0; i<len; i++)
        {
            pltn.push((-2*a1*math.cos(w[i]) + a1*a1 + 1)*(-2*b1*math.cos(w[i]) + b1*b1 + 1));
        }
    }
    else if(ln==3)
    {
        var a1 = numerator[0];
        var b1 = numerator[1];
        var c1 = numerator[2];
        for(var i=0; i<len; i++)
        {
            pltn.push((-2*a1*math.cos(w[i]) + a1*a1 + 1)*(-2*b1*math.cos(w[i]) + b1*b1 + 1)*(-2*c1*math.cos(w[i]) + c1*c1 + 1));
        }
    }

    // Denominator Calculation

    if(ld==0)
    {
        for(var i=0; i<len; i++)
        {
            pltd.push(1);
        }
    }
    else if(ld==1)
    {
        var a1 = denominator[0];
        for(var i=0; i<len; i++)
        {
            pltd.push(-2*a1*math.cos(w[i]) + a1*a1 + 1);
        }
    }
    else if(ld==2)
    {
        var a1 = denominator[0];
        var b1 = denominator[1];
        for(var i=0; i<len; i++)
        {
            pltd.push((-2*a1*math.cos(w[i]) + a1*a1 + 1)*(-2*b1*math.cos(w[i]) + b1*b1 + 1));
        }
    }
    else if(ld==3)
    {
        var a1 = denominator[0];
        var b1 = denominator[1];
        var c1 = denominator[2];
        for(var i=0; i<len; i++)
        {
            pltd.push((-2*a1*math.cos(w[i]) + a1*a1 + 1)*(-2*b1*math.cos(w[i]) + b1*b1 + 1)*(-2*c1*math.cos(w[i]) + c1*c1 + 1));
        }
    }

    // Total fraction

    for(var i=0; i<len; i++)
    {
        plty.push(pltn[i]/pltd[i]);
    }

    for(var i=0; i<ln; i++)
    {
        xn.push(0);
    }
    for(var i=0; i<ld; i++)
    {
        xd.push(0);
    }
    
    var layout = {
        title: 'Pole-Zero',
        showlegend: false,
        shapes: [
          // Unfilled Circle
          {
            type: 'circle',
            xref: 'x',
            yref: 'y',
            x0: -1,
            y0: -1,
            x1: 1,
            y1: 1,
            line: {
                dash: 'dot',
                width: 2
            }
          },
        ]
    };

    
    var trace1 = {
        x: numerator,
        y: xn,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace2 = {
        x: denominator,
        y: xd,
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'cross',
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace3 = {
        x: w,
        y: plty,
        type: 'scatter',
        mode: 'line',
    };
      
    var data = [trace1, trace2];
    var data1 = [trace3];

    var config = {responsive: true}
    var layout1 = {
        title: '|H(z)|',
        showlegend: false,
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };
      
    Plotly.newPlot('figure1', data, layout, config);
      var update = {
        width: 375,
        height: 375
    };
    Plotly.relayout('figure1', update);
    Plotly.newPlot('figure2', data1, layout1, config);
      var update = {
        width: 375,
        height: 375
    };
    Plotly.relayout('figure2', update);
    
    ln = numerator.length;
    ld = denominator.length;
    var message = "$ \frac{";

    for(var i=0; i<ln; i++)
    {
        message += "(z-" + numerator[i] + ") ";
    }

    message += "}{";

    for(var i=0; i<ld; i++)
    {
        message += "(z-" + denominator[i] + ") ";
    }
    
    message += "} $";

    var element = document.getElementById("result4")
    element.style.color = "#000000";
    element.style.fontWeight = "bold";
    element.innerHTML = message;
}

function poleZero(){
    var a = document.getElementById("fillSec11").value;
    a = parseFloat(a);
    var b = document.getElementById("fillSec12").value;
    b = parseFloat(b);
    var c = document.getElementById("fillSec13").value;
    c = parseFloat(c);
    var d = document.getElementById("fillSec14").value;
    d = parseFloat(d);
    var e = document.getElementById("fillSec15").value;
    e = parseFloat(e);
    var f = document.getElementById("fillSec16").value;
    f = parseFloat(f);

    var numerator = [];
    var denominator = [];
    if(!isNaN(a) && a!=d && a!=e && a!=f)
    {
        numerator.push(a);
    }
    if(!isNaN(b) && b!=d && b!=e && b!=f)
    {
        numerator.push(b);
    }
    if(!isNaN(c) && c!=d && c!=e && c!=f)
    {
        numerator.push(c);
    }
    if(!isNaN(d) && d!=a && d!=b && d!=c)
    {
        denominator.push(d);
    }
    if(!isNaN(e) && e!=a && e!=b && e!=c)
    {
        denominator.push(e);
    }
    if(!isNaN(f) && f!=a && f!=b && f!=c)
    {
        denominator.push(f);
    }
    
    /*
    console.log(numerator);
    console.log(denominator);
    */

    var ln = numerator.length;
    var xn = [], xd = [];
    var ld = denominator.length;

    var len = 100;
    var w = [], plty = [], pltn = [], pltd = [];
    w = makeArr(-math.PI,math.PI,len);

    // Numerator Calculation

    if(ln==0)
    {
        for(var i=0; i<len; i++)
        {
            pltn.push(1);
        }
    }
    else if(ln==1)
    {
        var a1 = numerator[0];
        for(var i=0; i<len; i++)
        {
            pltn.push(-2*a1*math.cos(w[i]) + a1*a1 + 1);
        }
    }
    else if(ln==2)
    {
        var a1 = numerator[0];
        var b1 = numerator[1];
        for(var i=0; i<len; i++)
        {
            pltn.push((-2*a1*math.cos(w[i]) + a1*a1 + 1)*(-2*b1*math.cos(w[i]) + b1*b1 + 1));
        }
    }
    else if(ln==3)
    {
        var a1 = numerator[0];
        var b1 = numerator[1];
        var c1 = numerator[2];
        for(var i=0; i<len; i++)
        {
            pltn.push((-2*a1*math.cos(w[i]) + a1*a1 + 1)*(-2*b1*math.cos(w[i]) + b1*b1 + 1)*(-2*c1*math.cos(w[i]) + c1*c1 + 1));
        }
    }

    // Denominator Calculation

    if(ld==0)
    {
        for(var i=0; i<len; i++)
        {
            pltd.push(1);
        }
    }
    else if(ld==1)
    {
        var a1 = denominator[0];
        for(var i=0; i<len; i++)
        {
            pltd.push(-2*a1*math.cos(w[i]) + a1*a1 + 1);
        }
    }
    else if(ld==2)
    {
        var a1 = denominator[0];
        var b1 = denominator[1];
        for(var i=0; i<len; i++)
        {
            pltd.push((-2*a1*math.cos(w[i]) + a1*a1 + 1)*(-2*b1*math.cos(w[i]) + b1*b1 + 1));
        }
    }
    else if(ld==3)
    {
        var a1 = denominator[0];
        var b1 = denominator[1];
        var c1 = denominator[2];
        for(var i=0; i<len; i++)
        {
            pltd.push((-2*a1*math.cos(w[i]) + a1*a1 + 1)*(-2*b1*math.cos(w[i]) + b1*b1 + 1)*(-2*c1*math.cos(w[i]) + c1*c1 + 1));
        }
    }

    // Total fraction

    for(var i=0; i<len; i++)
    {
        plty.push(pltn[i]/pltd[i]);
    }

    for(var i=0; i<ln; i++)
    {
        xn.push(0);
    }
    for(var i=0; i<ld; i++)
    {
        xd.push(0);
    }
    
    var layout = {
        title: 'Pole-Zero',
        showlegend: false,
        shapes: [
          // Unfilled Circle
          {
            type: 'circle',
            xref: 'x',
            yref: 'y',
            x0: -1,
            y0: -1,
            x1: 1,
            y1: 1,
            line: {
                dash: 'dot',
                width: 2
            }
          },
        ]
    };

    var trace1 = {
        x: numerator,
        y: xn,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace2 = {
        x: denominator,
        y: xd,
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'cross',
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace3 = {
        x: w,
        y: plty,
        type: 'scatter',
        mode: 'line',
    };
      
    var data = [trace1, trace2];
    var data1 = [trace3];

    var config = {responsive: true}
    var layout1 = {
        title: '|H(z)|',
        showlegend: false,
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };
      
    Plotly.newPlot('figure1', data, layout, config);
      var update = {
        width: 375,
        height: 375
    };
    Plotly.relayout('figure1', update);
    Plotly.newPlot('figure2', data1, layout1, config);
      var update = {
        width: 375,
        height: 375
    };
    Plotly.relayout('figure2', update);

    ln = numerator.length;
    ld = denominator.length;
    var message = "$$ \\frac{";

    for(var i=0; i<ln; i++)
    {
        message += "(z-" + numerator[i] + ") ";
    }

    message += "}{";

    for(var i=0; i<ld; i++)
    {
        message += "(z-" + denominator[i] + ") ";
    }
    
    message += "} $$";

    var element = document.getElementById("result4")
    element.style.color = "#000000";
    element.style.fontWeight = "bold";
    element.innerHTML = message;
}

// -------------------------------------- Separate CSV -----------------------------------------------------------

function separate(input,select)
{
    var l = input.length;
    var temp = "";
    var final = [];
    for(var i=0; i<l; i++)
    {
        if(input[i]==',')
        {
            var h;
            if(temp=="Inf")
            {
                h = 99999;
            }
            if(select==1)
            {
                h = parseInt(temp);
            }
            else
            {
                h = parseFloat(temp);
            }
            final.push(h);
            temp = "";
        }
        else
        {
            temp = temp + input[i];
        }
    }
    if(select==1)
    {
        var o = parseInt(temp);
        final.push(o);
        if(temp=="Inf")
        {
            o = 99999;
        }
    }
    else
    {
        var o = parseFloat(temp);
        final.push(o);
        if(temp=="Inf")
        {
            o = 99999;
        }
    }
    return final;
}

// -------------------------------------- ROC Number -------------------------------------------------

function ROCCalc(all)
{
    var unique = all.filter((item, i, ar) => ar.indexOf(item) === i);
    unique.sort(function(a,b){return a-b});
    return unique;
}

function ROCNumberInit(){

    var mine=0;

    var all = [];

    var numerator = [];
    var denominator = [];

    while(mine<2)
    {

        var numPoles = Math.floor(Math.random()*4)+1;
    
        var a = 3*Math.random()-1.5;
        var b = 3*Math.random()-1.5;
        var c = 3*Math.random()-1.5;
        var d = 3*Math.random()-1.5;
        var e = 3*Math.random()-1.5;
        var f = 3*Math.random()-1.5;

        numerator = [], denominator = [], all = [];

        if(numPoles==1)
        {
            if(Math.abs(a-c)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(a);
            }
            if(Math.abs(b-c)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(b);
            }
            if(Math.abs(a-c)>0.01 && Math.abs(b-c)>0.01)
            {
                denominator.push(c);
                all.push(Math.abs(c));
            }
        }
        else if(numPoles==2)
        {
            if(Math.abs(a-c)>0.01 && Math.abs(a-d)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(a);
            }
            if(Math.abs(b-c)>0.01 && Math.abs(b-d)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(b);
            }
            if(Math.abs(a-c)>0.01 && Math.abs(b-c)>0.01 && Math.abs(c-d)>0.01)
            {
                denominator.push(c);
                all.push(Math.abs(c));
            }
            if(Math.abs(a-d)>0.01 && Math.abs(b-d)>0.01 && Math.abs(c-d)>0.01)
            {
                denominator.push(d);
                all.push(Math.abs(d));
            }
        }
        else if(numPoles==3)
        {
            if(Math.abs(a-c)>0.01 && Math.abs(a-d)>0.01 && Math.abs(a-e)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(a);
            }
            if(Math.abs(b-c)>0.01 && Math.abs(b-d)>0.01 && Math.abs(b-e)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(b);
            }
            if(Math.abs(a-c)>0.01 && Math.abs(b-c)>0.01 && Math.abs(c-d)>0.01 && Math.abs(c-e)>0.01)
            {
                denominator.push(c);
                all.push(Math.abs(c));
            }
            if(Math.abs(a-d)>0.01 && Math.abs(b-d)>0.01 && Math.abs(c-d)>0.01 && Math.abs(d-e)>0.01)
            {
                denominator.push(d);
                all.push(Math.abs(d));
            }
            if(Math.abs(a-e)>0.01 && Math.abs(b-e)>0.01 && Math.abs(d-e)>0.01 && Math.abs(c-e)>0.01)
            {
                denominator.push(e);
                all.push(Math.abs(e));
            }
        }
        else
        {
            if(Math.abs(a-c)>0.01 && Math.abs(a-d)>0.01 && Math.abs(a-e)>0.01 && Math.abs(a-f)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(a);
            }
            if(Math.abs(b-c)>0.01 && Math.abs(b-d)>0.01 && Math.abs(b-e)>0.01 && Math.abs(b-f)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(b);
            }
            if(Math.abs(a-c)>0.01 && Math.abs(b-c)>0.01 && Math.abs(c-d)>0.01 && Math.abs(c-e)>0.01 && Math.abs(c-f)>0.01)
            {
                denominator.push(c);
                all.push(Math.abs(c));
            }
            if(Math.abs(a-d)>0.01 && Math.abs(b-d)>0.01 && Math.abs(d-c)>0.01 && Math.abs(d-e)>0.01 && Math.abs(d-f)>0.01)
            {
                denominator.push(d);
                all.push(Math.abs(d));
            }
            if(Math.abs(a-e)>0.01 && Math.abs(b-e)>0.01 && Math.abs(e-c)>0.01 && Math.abs(e-d)>0.01 && Math.abs(e-f)>0.01)
            {
                denominator.push(e);
                all.push(Math.abs(e));
            }
            if(Math.abs(a-f)>0.01 && Math.abs(b-f)>0.01 && Math.abs(f-c)>0.01 && Math.abs(f-d)>0.01 && Math.abs(f-e)>0.01)
            {
                denominator.push(f);
                all.push(Math.abs(f));
            }
        }

        poles = ROCCalc(all);
        mine = poles.length+1;
    }
    
    ROCNum = mine;

    var ln = numerator.length;
    var xn = [], xd = [];
    var ld = denominator.length;
    for(var i=0; i<ln; i++)
    {
        xn.push(0);
    }
    for(var i=0; i<ld; i++)
    {
        xd.push(0);
    }
    
    var layout = {
        title: 'Pole-Zero',
        showlegend: false,
        shapes: [
          // Unfilled Circle
          {
            type: 'circle',
            xref: 'x',
            yref: 'y',
            x0: -1,
            y0: -1,
            x1: 1,
            y1: 1,
            line: {
                dash: 'dot',
                width: 2
            }
          },
        ]
    };

    
    var trace1 = {
        x: numerator,
        y: xn,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace2 = {
        x: denominator,
        y: xd,
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'cross',
            size: 10,
            line: {
                width: 1
            }
        }
    };

      
    var data = [trace1, trace2];
    var config = {responsive: true}
      
    Plotly.newPlot('figure3', data, layout, config);
      var update = {
        width: 500,
        height: 375
    };
    Plotly.relayout('figure3', update);
    /*Plotly.newPlot('figure4', data, layout, config);
      var update = {
        width: 500,
        height: 375
    };
    Plotly.relayout('figure4', update);*/
}

function ROCNumber(){

    var ans = document.getElementById("fillSec21").value;
    ans = parseInt(ans);

    var mine = ROCNum;
    if(ans==mine)
    {
        var element = document.getElementById("result2")
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Right Answer! Now enter the ROCs';
        var x = document.getElementById("wrapper");
        if (x.style.display === "none") {
            x.style.display = "block";
        }
        x = document.getElementById("buttonSec32");
        if (x.style.display === "none") {
            x.style.display = "block";
        }
    }
    else
    {
        var element = document.getElementById("result2")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!';
        var x = document.getElementById("wrapper");
        if (x.style.display === "none") {
            //x.style.display = "block";
        }
        else
        {
            x.style.display = "none";
        }
        x = document.getElementById("buttonSec32");
        if (x.style.display === "none") {
            //x.style.display = "block";
        }
        else
        {
            x.style.display = "none";
        }
    }
}

// ------------------------------------------ ROC Lists ----------------------------------------------------------

function allROCNumberInit()
{
    for(var i=0; i<ROCNum; i++)
    {
        document.getElementById("buttonSec31").click();
    }
    myFunction();
}

function myFunction() {
    var x = document.getElementById("buttonSec31");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    x = document.getElementById("wrapper");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    x = document.getElementById("buttonSec32");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function ROCList(){

    var ROCS = createArray(ROCNum+1,2);
    for(var i=1; i<=ROCNum; i++)
    {
        var ROCString = document.getElementById("ROC_"+i+"").value;
        var temp = separate(ROCString,2);
        if(isNaN(temp[1]))
        {
            temp[1] = 99999;
        }
        ROCS[i-1][0] = temp[0];
        ROCS[i-1][1] = temp[1];
    }


    var flag = 1;
    var polesNow = [];
    for(var i=0; i<ROCNum; i++)
    {
        if((i==0 && ROCS[i][0]!=0) || (i==ROCNum-1 && ROCS[i][1]!=99999))
        {
            flag = 0;
            break;
        }
        if(i!=0)
        {
            if(ROCS[i][0]!=ROCS[i-1][1])
            {
                flag = 0;
                break;
            }
            polesNow.push(Math.floor(ROCS[i-1][1]*100));
        }
    }

    var l = polesNow.length;

    var poles123 = [];
    for(var i=0; i<ROCNum; i++)
    {
        poles123.push(Math.floor(Math.abs(poles[i]*100)));
    }

    poles123.sort(function(a,b){return a-b});

    if(flag==0 || l!=ROCNum-1)
    {
        var element = document.getElementById("result2")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!';
        return;
    }

    console.log(polesNow, poles123);

    flag = 1;
    for(var i=0; i<ROCNum-1; i++)
    {
        if(polesNow[i]!=poles123[i])
        {
            flag = 0;
            break;
        }
    }

    if(flag)
    {
        var element = document.getElementById("result2")
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Right Answer!';
    }
    else
    {
        var element = document.getElementById("result2")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!';
    }
}

// ------------------------------------------- Polynomial ----------------------------------------------

/*
function polyInit()
{
    var a = 2*Math.random()-1;
    var b = 2*Math.random()-1;
    var c = 2*Math.random()-1;
    var d = 2*Math.random()-1;
    var e = 2*Math.random()-1;
    var f = 2*Math.random()-1;

    var all = [];
    all.push(Math.abs(c));
    all.push(Math.abs(d));
    all.push(Math.abs(e));
    all.push(Math.abs(f));

    var poles123 = ROCCalc(all);
    var mine = poles123.length+1;
    ROCNum1 = mine;

    var numerator = [];
    var denominator = [];
    if(a!=c && a!=d && a!=e && a!=f)
    {
        numerator.push(a);
    }
    if(b!=c && b!=d && b!=e && b!=f)
    {
        numerator.push(b);
    }
    if(c!=a && c!=b)
    {
        denominator.push(c);
    }
    if(d!=a && d!=b)
    {
        denominator.push(d);
    }
    if(e!=a && e!=b)
    {
        denominator.push(e);
    }
    if(e!=a && e!=b)
    {
        denominator.push(f);
    }

    num = numerator;
    den = denominator;

    var ln = numerator.length;
    var xn = [], xd = [];
    var ld = denominator.length;
    for(var i=0; i<ln; i++)
    {
        xn.push(0);
    }
    for(var i=0; i<ld; i++)
    {
        xd.push(0);
    }
    
    var layout = {
        title: 'Pole-Zero',
        showlegend: false,
        shapes: [
          // Unfilled Circle
          {
            type: 'circle',
            xref: 'x',
            yref: 'y',
            x0: -1,
            y0: -1,
            x1: 1,
            y1: 1,
            line: {
                dash: 'dot',
                width: 2
            }
          },
        ]
    };

    
    var trace1 = {
        x: numerator,
        y: xn,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace2 = {
        x: denominator,
        y: xd,
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'cross',
            size: 10,
            line: {
                width: 1
            }
        }
    };

      
    var data = [trace1, trace2];
    var config = {responsive: true}
      
    Plotly.newPlot('figure5', data, layout, config);
      var update = {
        width: 500,
        height: 375
    };
    Plotly.relayout('figure5', update);
}

function poly()
{
    var numGiven = document.getElementById("fillSec41").value;
    var denGiven = document.getElementById("fillSec42").value;

    var numGot = separate(numGiven,2);
    var denGot = separate(denGiven,2);

    if(numGot.length != 3 || denGot.length != (5))
    {
        var element = document.getElementById("result3")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Enter Correct Values!';
        return;
    }

    var numerator = num;
    var denominator = den;

    var a = numerator[0];
    var b = numerator[1];
    var c = denominator[0];
    var d = denominator[1];
    var e = denominator[2];
    var f = denominator[3];

    if((numGot[0]!=(a*b)) || (numGot[1]!=(-1*(a+b))) || (numGot[2]!=1))
    {
        var element = document.getElementById("result3")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!';
        return;
    }
    if((Math.floor(denGot[0]*100)!=(Math.floor(c*d*e*f*100))) || (Math.floor(denGot[1]*100)!=Math.floor(-100*(c*d*e + d*e*f + e*f*c + f*c*d))) || (Math.floor(denGot[2]*100)!=Math.floor(100*(c*d + d*e + e*f + f*c + d*f + c*e))) || (Math.floor(denGot[3]*100)!=Math.floor(-100*(c + d + e + f))) || (Math.floor(denGot[4]*100)!=100))
    {
        var element = document.getElementById("result3")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!';
        return;
    }

    var element = document.getElementById("result3")
    element.style.color = "#006400";
    element.style.fontWeight = "bold";
    element.innerHTML = 'Right Answer!';
    
}
*/

// ------------------------------------------- Imag Pole-Zero --------------------------------------------

function poleZeroInitI(){
        
        var a = document.getElementById("fillSec51").value;
        a = parseFloat(a);
        var b = document.getElementById("fillSec52").value;
        b = parseFloat(b);
        var c = document.getElementById("fillSec53").value;
        c = parseFloat(c);
        var d = document.getElementById("fillSec54").value;
        d = parseFloat(d);
    
        var xn = [], xd = [], yn = [], yd = [];
    
        var len = 101;
        var w = [], plty = [], pltn = [], pltd = [];
        w = makeArr(-math.PI,math.PI,len);
    
        var numeratorR = [];
        var numeratorI = [];
        var denominatorR = [];
        var denominatorI = [];
        if(isNaN(a) && isNaN(b) && isNaN(c) && isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(1);
            }
        }
        else if(isNaN(a) && isNaN(b) && isNaN(c) && !isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(1/(((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d)) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
            }
            xd.push(0,0);
            yd.push(d,-d);
        }
        else if(isNaN(a) && isNaN(b) && !isNaN(c) && isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(1/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
            }
            xd.push(c,c);
            yd.push(0,0);
        }
        else if(isNaN(a) && isNaN(b) && !isNaN(c) && !isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(1/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
            }
            xd.push(c,c);
            yd.push(d,-d);
        }
        else if(isNaN(a) && !isNaN(b) && isNaN(c) && isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])));
            }
            xn.push(0,0);
            yn.push(b,-b);
        }
        else if(isNaN(a) && !isNaN(b) && isNaN(c) && !isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])))/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
            }
            xd.push(0,0);
            yd.push(d,-d);
            xn.push(0,0);
            yn.push(b,-b);
        }
        else if(isNaN(a) && !isNaN(b) && !isNaN(c) && isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.cos(w[i]))));
            }
            xd.push(c,c);
            yd.push(0,0);
            xn.push(0,0);
            yn.push(b,-b);
        }
        else if(isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.cos(w[i]))));
            }
            xd.push(c,c);
            yd.push(d,-d);
            xn.push(0,0);
            yn.push(b,-b);
        }
        else if(!isNaN(a) && isNaN(b) && isNaN(c) && isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math*cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])));
            }
            xn.push(a,a);
            yn.push(0,0);
        }
        else if(!isNaN(a) && isNaN(b) && isNaN(c) && !isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math*cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/(((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d)) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
            }
            xd.push(0,0);
            yd.push(d,-d);
            xn.push(a,a);
            yn.push(0,0);
        }
        else if(!isNaN(a) && isNaN(b) && !isNaN(c) && isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math*cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
            }
            xd.push(c,c);
            yd.push(0,0);
            xn.push(a,a);
            yn.push(0,0);
        }
        else if(!isNaN(a) && isNaN(b) && !isNaN(c) && !isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math*cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
            }
            xd.push(c,c);
            yd.push(d,-d);
            xn.push(a,a);
            yn.push(0,0);
        }
        else if(!isNaN(a) && !isNaN(b) && isNaN(c) && isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])));
            }
            xn.push(a,a);
            yn.push(b,-b);
        }
        else if(!isNaN(a) && !isNaN(b) && isNaN(c) && !isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i]))/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
            }
            xd.push(0,0);
            yd.push(d,-d);
            xn.push(a,a);
            yn.push(b,-b);
        }
        else if(!isNaN(a) && !isNaN(b) && !isNaN(c) && isNaN(d))
        {
            for(var i=0; i<len; i++)
            {
                plty.push((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i]))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.cos(w[i]))));
            }
            xd.push(c,c);
            yd.push(0,0);
            xn.push(a,a);
            yn.push(b,-b);
        }
        else
        {
            for(var i=0; i<len; i++)
            {
                plty.push((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i]))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.cos(w[i]))));
            }
            xd.push(c,c);
            yd.push(d,-d);
            xn.push(a,a);
            yn.push(b,-b);
        }
        
        var layout = {
            title: 'Pole-Zero',
            showlegend: false,
            shapes: [
              // Unfilled Circle
              {
                type: 'circle',
                xref: 'x',
                yref: 'y',
                x0: -1,
                y0: -1,
                x1: 1,
                y1: 1,
                line: {
                    dash: 'dot',
                    width: 2
                }
              },
            ]
        };
    
        
        var trace1 = {
            x: xn,
            y: yn,
            type: 'scatter',
            mode: 'markers',
            marker: {
                size: 10,
                line: {
                    width: 1
                }
            }
        };
        var trace2 = {
            x: xd,
            y: yd,
            type: 'scatter',
            mode: 'markers',
            marker: {
                symbol: 'cross',
                size: 10,
                line: {
                    width: 1
                }
            }
        };
        var trace3 = {
            x: w,
            y: plty,
            type: 'scatter',
            mode: 'line',
        };
          
        var data = [trace1, trace2];
        var data1 = [trace3];
    
        var config = {responsive: true}
        var layout1 = {
            title: '|H(z)|',
            showlegend: false,
            xaxis: {
                title: 'Frequency'
            },
            yaxis: {
                title: 'Magnitude'
            }
        };
          
        Plotly.newPlot('figure6', data, layout, config);
          var update = {
            width: 375,
            height: 375
        };
        Plotly.relayout('figure6', update);
        Plotly.newPlot('figure7', data1, layout1, config);
          var update = {
            width: 375,
            height: 375
        };
        Plotly.relayout('figure7', update);
}

function poleZeroI(){
        
    var a = document.getElementById("fillSec51").value;
    a = parseFloat(a);
    var b = document.getElementById("fillSec52").value;
    b = parseFloat(b);
    var c = document.getElementById("fillSec53").value;
    c = parseFloat(c);
    var d = document.getElementById("fillSec54").value;
    d = parseFloat(d);

    var xn = [], xd = [], yn = [], yd = [];

    var len = 101;
    var w = [], plty = [], pltn = [], pltd = [];
    w = makeArr(-math.PI,math.PI,len);

    if(isNaN(a) && isNaN(b) && isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(1);
        }
    }
    else if(isNaN(a) && isNaN(b) && isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(1/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xd.push(0,0);
        yd.push(d,-d);
    }
    else if(isNaN(a) && isNaN(b) && !isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(1/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(0,0);
    }
    else if(isNaN(a) && isNaN(b) && !isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(1/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(d,-d);
    }
    else if(isNaN(a) && !isNaN(b) && isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xn.push(0,0);
        yn.push(b,-b);
    }
    else if(isNaN(a) && !isNaN(b) && isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])))/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xd.push(0,0);
        yd.push(d,-d);
        xn.push(0,0);
        yn.push(b,-b);
    }
    else if(isNaN(a) && !isNaN(b) && !isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(0,0);
        xn.push(0,0);
        yn.push(b,-b);
    }
    else if(isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(d,-d);
        xn.push(0,0);
        yn.push(b,-b);
    }
    else if(!isNaN(a) && isNaN(b) && isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i]))));
        }
        xn.push(a,a);
        yn.push(0,0);
    }
    else if(!isNaN(a) && isNaN(b) && isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xd.push(0,0);
        yd.push(d,-d);
        xn.push(a,a);
        yn.push(0,0);
    }
    else if(!isNaN(a) && isNaN(b) && !isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(0,0);
        xn.push(a,a);
        yn.push(0,0);
    }
    else if(!isNaN(a) && isNaN(b) && !isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(d,-d);
        xn.push(a,a);
        yn.push(0,0);
    }
    else if(!isNaN(a) && !isNaN(b) && isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i]))));
        }
        xn.push(a,a);
        yn.push(b,-b);
    }
    else if(!isNaN(a) && !isNaN(b) && isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xd.push(0,0);
        yd.push(d,-d);
        xn.push(a,a);
        yn.push(b,-b);
    }
    else if(!isNaN(a) && !isNaN(b) && !isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(0,0);
        xn.push(a,a);
        yn.push(b,-b);
    }
    else
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(d,-d);
        xn.push(a,a);
        yn.push(b,-b);
    }
    
    var layout = {
        title: 'Pole-Zero',
        showlegend: false,
        shapes: [
          // Unfilled Circle
          {
            type: 'circle',
            xref: 'x',
            yref: 'y',
            x0: -1,
            y0: -1,
            x1: 1,
            y1: 1,
            line: {
                dash: 'dot',
                width: 2
            }
          },
        ]
    };

    var trace1 = {
        x: xn,
        y: yn,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace2 = {
        x: xd,
        y: yd,
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'cross',
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace3 = {
        x: w,
        y: plty,
        type: 'scatter',
        mode: 'line',
    };
      
    var data = [trace1, trace2];
    var data1 = [trace3];

    var config = {responsive: true}
    var layout1 = {
        title: '|H(z)|',
        showlegend: false,
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };
      
    Plotly.newPlot('figure6', data, layout, config);
      var update = {
        width: 375,
        height: 375
    };
    Plotly.relayout('figure6', update);
    Plotly.newPlot('figure7', data1, layout1, config);
      var update = {
        width: 375,
        height: 375
    };
    Plotly.relayout('figure7', update);
}

// ------------------------------------------------ Dynamic stability box ----------------------------------

function add_field1()
{
    if(uniquenumberofsignals1>=10)
    {
        return;
    }
    numberofsignals1 += 1;
    uniquenumberofsignals1 += 1;
  document.getElementById("field_div1").innerHTML=document.getElementById("field_div1").innerHTML+
  "<p id='input_num"+numberofsignals+"_wrapper1'><input type='text' class='input_text' id='ROC_"+numberofsignals1+"' placeholder='[R1 , R2]'><input type='checkbox' class='input_check' id='stability_"+numberofsignals1+"'><input type='checkbox' class='input_check' id='causality_"+numberofsignals1+"'></p>";
}
function remove_field1(id1)
{
    uniquenumberofsignals1 -= 1;
    const element = document.getElementById(id1+"_wrapper1");
    element.remove();
}


// --------------------------------------------------- Stability and Causality --------------------------------------

function stabilityInit()
{
    for(var i=0; i<ROCNumS; i++)
    {
        document.getElementById("buttonSec61").click();
    }
    myStabilityFunction();
}

function myStabilityFunction() {
    var x = document.getElementById("buttonSec61");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

function StabilityInit(){

    var mine=0;

    var all = [];

    var numerator = [];
    var denominator = [];

    while(mine<2)
    {

        var numPoles = Math.floor(Math.random()*4)+1;
    
        var a = 3*Math.random()-1.5;
        var b = 3*Math.random()-1.5;
        var c = 3*Math.random()-1.5;
        var d = 3*Math.random()-1.5;
        var e = 3*Math.random()-1.5;
        var f = 3*Math.random()-1.5;

        numerator = [], denominator = [], all = [];

        if(numPoles==1)
        {
            if(Math.abs(a-c)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(a);
            }
            if(Math.abs(b-c)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(b);
            }
            if(Math.abs(a-c)>0.01 && Math.abs(b-c)>0.01 && Math.abs(Math.abs(c)-1)>0.01)
            {
                denominator.push(c);
                all.push(Math.abs(c));
            }
        }
        else if(numPoles==2)
        {
            if(Math.abs(a-c)>0.01 && Math.abs(a-d)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(a);
            }
            if(Math.abs(b-c)>0.01 && Math.abs(b-d)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(b);
            }
            if(Math.abs(a-c)>0.01 && Math.abs(b-c)>0.01 && Math.abs(c-d)>0.01 && Math.abs(Math.abs(c)-1)>0.01)
            {
                denominator.push(c);
                all.push(Math.abs(c));
            }
            if(Math.abs(a-d)>0.01 && Math.abs(b-d)>0.01 && Math.abs(c-d)>0.01 && Math.abs(Math.abs(d)-1)>0.01)
            {
                denominator.push(d);
                all.push(Math.abs(d));
            }
        }
        else if(numPoles==3)
        {
            if(Math.abs(a-c)>0.01 && Math.abs(a-d)>0.01 && Math.abs(a-e)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(a);
            }
            if(Math.abs(b-c)>0.01 && Math.abs(b-d)>0.01 && Math.abs(b-e)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(b);
            }
            if(Math.abs(a-c)>0.01 && Math.abs(b-c)>0.01 && Math.abs(c-d)>0.01 && Math.abs(c-e)>0.01 && Math.abs(Math.abs(c)-1)>0.01)
            {
                denominator.push(c);
                all.push(Math.abs(c));
            }
            if(Math.abs(a-d)>0.01 && Math.abs(b-d)>0.01 && Math.abs(c-d)>0.01 && Math.abs(d-e)>0.01 && Math.abs(Math.abs(d)-1)>0.01)
            {
                denominator.push(d);
                all.push(Math.abs(d));
            }
            if(Math.abs(a-e)>0.01 && Math.abs(b-e)>0.01 && Math.abs(d-e)>0.01 && Math.abs(c-e)>0.01 && Math.abs(Math.abs(e)-1)>0.01)
            {
                denominator.push(e);
                all.push(Math.abs(e));
            }
        }
        else
        {
            if(Math.abs(a-c)>0.01 && Math.abs(a-d)>0.01 && Math.abs(a-e)>0.01 && Math.abs(a-f)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(a);
            }
            if(Math.abs(b-c)>0.01 && Math.abs(b-d)>0.01 && Math.abs(b-e)>0.01 && Math.abs(b-f)>0.01 && Math.abs(a-b)>0.01)
            {
                numerator.push(b);
            }
            if(Math.abs(a-c)>0.01 && Math.abs(b-c)>0.01 && Math.abs(c-d)>0.01 && Math.abs(c-e)>0.01 && Math.abs(c-f)>0.01 && Math.abs(Math.abs(c)-1)>0.01)
            {
                denominator.push(c);
                all.push(Math.abs(c));
            }
            if(Math.abs(a-d)>0.01 && Math.abs(b-d)>0.01 && Math.abs(d-c)>0.01 && Math.abs(d-e)>0.01 && Math.abs(d-f)>0.01 && Math.abs(Math.abs(d)-1)>0.01)
            {
                denominator.push(d);
                all.push(Math.abs(d));
            }
            if(Math.abs(a-e)>0.01 && Math.abs(b-e)>0.01 && Math.abs(e-c)>0.01 && Math.abs(e-d)>0.01 && Math.abs(e-f)>0.01 && Math.abs(Math.abs(e)-1)>0.01)
            {
                denominator.push(e);
                all.push(Math.abs(e));
            }
            if(Math.abs(a-f)>0.01 && Math.abs(b-f)>0.01 && Math.abs(f-c)>0.01 && Math.abs(f-d)>0.01 && Math.abs(f-e)>0.01 && Math.abs(Math.abs(f)-1)>0.01)
            {
                denominator.push(f);
                all.push(Math.abs(f));
            }
        }

        poles1 = ROCCalc(all);
        mine = poles1.length+1;
    }
    
    ROCNumS = mine;

    var ln = numerator.length;
    var xn = [], xd = [];
    var ld = denominator.length;
    for(var i=0; i<ln; i++)
    {
        xn.push(0);
    }
    for(var i=0; i<ld; i++)
    {
        xd.push(0);
    }
    
    var layout = {
        title: 'Pole-Zero',
        showlegend: false,
        shapes: [
          // Unfilled Circle
          {
            type: 'circle',
            xref: 'x',
            yref: 'y',
            x0: -1,
            y0: -1,
            x1: 1,
            y1: 1,
            line: {
                dash: 'dot',
                width: 2
            }
          },
        ]
    };

    
    var trace1 = {
        x: numerator,
        y: xn,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace2 = {
        x: denominator,
        y: xd,
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'cross',
            size: 10,
            line: {
                width: 1
            }
        }
    };

      
    var data = [trace1, trace2];
    var config = {responsive: true}
      
    Plotly.newPlot('figure8', data, layout, config);
      var update = {
        width: 500,
        height: 375
    };
    Plotly.relayout('figure8', update);

    var rocs = [];
    for(var i=0; i<ROCNumS; i++)
    {
        if(i==0)
        {
            rocs.push(""+(i+1)+": ["+0+", "+Math.floor(poles1[i]*100)/100+"]");
            var left = 0;
            var right = Math.floor(poles1[i]*100)/100;
            if(left<1 && right>1)
            {
                stable = 1;
            }
        }
        else if(i==ROCNumS-1)
        {
            rocs.push("\n"+(i+1)+": ["+Math.floor(poles1[i-1]*100)/100+", Inf]");
            var left = Math.floor(poles1[i-1]*100)/100;
            if(left<1)
            {
                stable = i+1;
            }
        }
        else
        {
            rocs.push("\n"+(i+1)+": ["+Math.floor(poles1[i-1]*100)/100+", "+Math.floor(poles1[i]*100)/100+"]");
            var left = Math.floor(poles1[i-1]*100)/100;
            var right = Math.floor(poles1[i]*100)/100;
            if(left<1 && right>1)
            {
                stable = i+1;
            }
        }
    }
    causal = ROCNumS;
    var element = document.getElementById("rocs1")
    element.style.color = "#FF0000";
    element.style.fontWeight = "bold";
    element.style.fontSize = "x-large";
    element.innerHTML = "<pre>" + rocs + "<\pre>";
}

function stabilityCheck()
{
    var st = document.getElementById("fillSec61").value;
    st = parseInt(st);
    var ca = document.getElementById("fillSec62").value;
    ca = parseInt(ca);

    if(st==stable && ca==causal)
    {
        var element = document.getElementById("result8")
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = "Both are correct!";
    }
    else if(st!=stable && ca==causal)
    {
        var element = document.getElementById("result8")
        element.style.color = "#FFD700";
        element.style.fontWeight = "bold";
        element.innerHTML = "Stability is WRONG! Causality is correct!";
    }
    else if(st==stable && ca!=causal)
    {
        var element = document.getElementById("result8")
        element.style.color = "#FFD700";
        element.style.fontWeight = "bold";
        element.innerHTML = "Stability is correct! Causality is WRONG!";
    }
    else
    {
        var element = document.getElementById("result8")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = "Both are WRONG!";
    }
}

// ------------------------------------------ Filtering -------------------------------------------

function filteringInit(){

    var filterChoiceVar = Math.random();
    if(filterChoiceVar<0.5)
    {
        filterChoice = 1;
        var element = document.getElementById("rocs2")
        element.style.color = "#000000";
        element.style.fontWeight = "bold";
        element.style.fontSize = "x-large";
        element.innerHTML = "LOW PASS FILTER";
    }
    else
    {
        filterChoice = 2;
        var element = document.getElementById("rocs2")
        element.style.color = "#000000";
        element.style.fontWeight = "bold";
        element.style.fontSize = "x-large";
        element.innerHTML = "HIGH PASS FILTER";
    }

    var len = 101;
    var ploty = [];
    var w = makeArr(-Math.PI,Math.PI,len);
    for(var i=0; i<len; i++)
    {
        ploty.push(1);
    }
    
    var trace1 = {
        x: w,
        y: ploty,
        type: 'scatter',
        mode: 'line',
    };

    var layout1 = {
        title: '|H(z)|',
        showlegend: false,
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };

      
    var data = [trace1];
    var config = {responsive: true}
      
    Plotly.newPlot('figure9', data, layout1, config);
      var update = {
        width: 500,
        height: 375
    };
    Plotly.relayout('figure9', update);
}

function filterCheck()
{
    var a = document.getElementById("fillSec81").value;
    a = parseFloat(a);
    var b = document.getElementById("fillSec82").value;
    b = parseFloat(b);
    var c = document.getElementById("fillSec83").value;
    c = parseFloat(c);
    var d = document.getElementById("fillSec84").value;
    d = parseFloat(d);

    var xn = [], xd = [], yn = [], yd = [];

    var len = 101;
    var w = [], plty = [], pltn = [], pltd = [];
    w = makeArr(-math.PI,math.PI,len);

    if(isNaN(a) && isNaN(b) && isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(1);
        }
    }
    else if(isNaN(a) && isNaN(b) && isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(1/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xd.push(0,0);
        yd.push(d,-d);
    }
    else if(isNaN(a) && isNaN(b) && !isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(1/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(0,0);
    }
    else if(isNaN(a) && isNaN(b) && !isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(1/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(d,-d);
    }
    else if(isNaN(a) && !isNaN(b) && isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xn.push(0,0);
        yn.push(b,-b);
    }
    else if(isNaN(a) && !isNaN(b) && isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])))/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xd.push(0,0);
        yd.push(d,-d);
        xn.push(0,0);
        yn.push(b,-b);
    }
    else if(isNaN(a) && !isNaN(b) && !isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(0,0);
        xn.push(0,0);
        yn.push(b,-b);
    }
    else if(isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])+b*b)*(Math.cos(2*w[i])+b*b) + (Math.sin(2*w[i]))*(Math.sin(2*w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(d,-d);
        xn.push(0,0);
        yn.push(b,-b);
    }
    else if(!isNaN(a) && isNaN(b) && isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i]))));
        }
        xn.push(a,a);
        yn.push(0,0);
    }
    else if(!isNaN(a) && isNaN(b) && isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xd.push(0,0);
        yd.push(d,-d);
        xn.push(a,a);
        yn.push(0,0);
    }
    else if(!isNaN(a) && isNaN(b) && !isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(0,0);
        xn.push(a,a);
        yn.push(0,0);
    }
    else if(!isNaN(a) && isNaN(b) && !isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(d,-d);
        xn.push(a,a);
        yn.push(0,0);
    }
    else if(!isNaN(a) && !isNaN(b) && isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i]))));
        }
        xn.push(a,a);
        yn.push(b,-b);
    }
    else if(!isNaN(a) && !isNaN(b) && isNaN(c) && !isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])+d*d)*(Math.cos(2*w[i])+d*d) + (Math.sin(2*w[i]))*(Math.sin(2*w[i]))));
        }
        xd.push(0,0);
        yd.push(d,-d);
        xn.push(a,a);
        yn.push(b,-b);
    }
    else if(!isNaN(a) && !isNaN(b) && !isNaN(c) && isNaN(d))
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(0,0);
        xn.push(a,a);
        yn.push(b,-b);
    }
    else
    {
        for(var i=0; i<len; i++)
        {
            plty.push(((Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b)*(Math.cos(2*w[i])-2*a*Math.cos(w[i])+a*a+b*b) + (Math.sin(2*w[i])-2*a*Math.sin(w[i]))*(Math.sin(2*w[i])-2*a*Math.sin(w[i])))/((Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d)*(Math.cos(2*w[i])-2*c*Math.cos(w[i])+c*c+d*d) + (Math.sin(2*w[i])-2*c*Math.sin(w[i]))*(Math.sin(2*w[i])-2*c*Math.sin(w[i]))));
        }
        xd.push(c,c);
        yd.push(d,-d);
        xn.push(a,a);
        yn.push(b,-b);
    }

    var lp = plty[parseInt((len-1)/2)];
    var hp = plty[0];

    var result1 = plty.indexOf(Math.max(...plty));
    var result2 = plty.indexOf(Math.min(...plty));

    if(filterChoice==1)
    {
        if(result1==parseInt((len-1)/2) && (result2==0 || result2==len-1))
        {
            var element = document.getElementById("result5")
            element.style.color = "#006400";
            element.style.fontWeight = "bold";
            element.innerHTML = "Right Answer!";
        }
        else
        {
            var element = document.getElementById("result5")
            element.style.color = "#FF0000";
            element.style.fontWeight = "bold";
            element.innerHTML = "Wrong Answer!";
        }
    }
    else
    {
        if(result2==parseInt((len-1)/2) && (result1==0 || result1==len-1))
        {
            var element = document.getElementById("result5")
            element.style.color = "#006400";
            element.style.fontWeight = "bold";
            element.innerHTML = "Right Answer!";
        }
        else
        {
            var element = document.getElementById("result5")
            element.style.color = "#FF0000";
            element.style.fontWeight = "bold";
            element.innerHTML = "Wrong Answer!";
        }
    }

    var trace3 = {
        x: w,
        y: plty,
        type: 'scatter',
        mode: 'line',
    };

    var data1 = [trace3];

    var config = {responsive: true}
    var layout1 = {
        title: '|H(z)|',
        showlegend: false,
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };
    
    Plotly.newPlot('figure9', data1, layout1, config);
      var update = {
        width: 375,
        height: 375
    };
    Plotly.relayout('figure9', update);
}

// ---------------------------- LinSpace --------------------------------------

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
}

// ------------------------------------------ On startup ----------------------------------------------------------

function startup()
{
    poleZeroInit();
    ROCNumberInit();
    allROCNumberInit();
    //polyInit();
    poleZeroInitI();
    StabilityInit();
    filteringInit();
    //stabilityInit();
    document.getElementById("default").click();
}

window.onload = startup;