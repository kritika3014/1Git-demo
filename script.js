let subjects = JSON.parse(localStorage.getItem('bunkSubjects')) || [];

function submitAndGo() {
  const name = document.getElementById('subName').value.trim() || "Subject";
  const target = parseFloat(document.getElementById('targetPer').value);
  const totalSem = parseInt(document.getElementById('totalSem').value);
  const total = parseInt(document.getElementById('total').value);
  const attended = parseInt(document.getElementById('attended').value);
  const weekTotal = parseInt(document.getElementById('weekTotal').value) || 0;
  const weekAtt = parseInt(document.getElementById('weekAtt').value) || 0;

  if (!totalSem || !total || isNaN(attended) || attended > total) {
    alert("Fill correctly!");
    return;
  }

  const weekAbsent = weekTotal - weekAtt;
  const absentTillNow = total - attended;
  const remainingClasses = totalSem - total;
  
  // YOUR LOGIC: For 32 classes you can bunk 6 for 85%
  // So Required = Total - 6 = 26
  // General formula for your college logic:
  let maxBunkWholeSem;
  if (target === 85) {
    // As per your rule: 32 -> 6 bunk, so ratio = 6/32 = 18.75% bunk allowed
    maxBunkWholeSem = Math.ceil(totalSem * 0.1875); // 32*0.1875 = 6
  } else if (target === 75) {
    maxBunkWholeSem = Math.ceil(totalSem * 0.25); // 32*0.25 = 8
  } else {
    maxBunkWholeSem = Math.ceil(totalSem * (100 - target) / 100);
  }

  let requiredForTarget = totalSem - maxBunkWholeSem; // For 32, 85% => 26
  let mustAttendInFuture = Math.max(0, requiredForTarget - attended);
  let canBunkInFuture = Math.max(0, remainingClasses - mustAttendInFuture);

  let data = {
    id: Date.now(), name, targetPer: target, totalSem, total, attended,
    absentTillNow, weekTotal, weekAtt, weekAbsent,
    remainingClasses, requiredForTarget, maxBunkWholeSem,
    mustAttendInFuture, canBunkInFuture
  };

  subjects.push(data);
  localStorage.setItem('bunkSubjects', JSON.stringify(subjects));
  window.location.href = 'dashboard.html';
}

function deleteSubject(id) {
  subjects = subjects.filter(s => s.id !== id);
  localStorage.setItem('bunkSubjects', JSON.stringify(subjects));
  render();
}
function render() {
  const list = document.getElementById('subjectList');
  if (!list) return;
  list.innerHTML = "";
  subjects.slice().reverse().forEach(sub => {
    const div = document.createElement('div');
    div.className = 'subject-card';
    div.innerHTML = `<div><b>${sub.name} - ${sub.targetPer}%</b><small style="display:block;">Need ${sub.requiredForTarget}/${sub.totalSem} | Bunk: ${sub.maxBunkWholeSem}</small></div><button onclick="deleteSubject(${sub.id})" style="background:none;border:none;color:#ff4757;font-size:20px;">✕</button>`;
    list.appendChild(div);
  });
}
render();