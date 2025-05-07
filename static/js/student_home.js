function createJobCard(job, isApplied) {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    jobCard.innerHTML = `
        <div>${job.job_role}</div>
        <div>Company: ${job.company}</div>
        <div>Package: ${job.package}</div>
        <button onclick='viewJob(${job.id})'>View</button>
    `;

    if (isApplied) {
        jobCard.innerHTML += `<button onclick='withdrawJob(${job.id})'>Withdraw</button>`;
    } else {
        jobCard.innerHTML += `<button onclick='applyJob(${job.id})'>Apply</button>`;
    }

    return jobCard;
    
}

document.addEventListener('DOMContentLoaded', function () {
    const usn = localStorage.getItem('usn');
    if (!usn) {
        window.location.href = '/student_login';
        return;
    }

    fetch('/api/jobs_by_status')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                window.location.href = '/student_login';
                return;
            }

            const jobsNotApplied = data.not_applied;
            const jobsApplied = data.applied;

            const jobsTableNotApplied = document.getElementById('jobsTableNotApplied');
            const jobsTableApplied = document.getElementById('jobsTableApplied');

            jobsNotApplied.forEach(job => {
                const jobCard = createJobCard(job, false);
                jobsTableNotApplied.appendChild(jobCard);
            });

            jobsApplied.forEach(job => {
                const jobCard = createJobCard(job, true);
                jobsTableApplied.appendChild(jobCard);
            });

            // Optional: Display student name from sessionStorage
            const studentName = sessionStorage.getItem('student_name');
            if (studentName && document.getElementById('studentName')) {
                document.getElementById('studentName').innerText = studentName;
            }
        })
        .catch(error => console.error('Error fetching jobs:', error));

    document.getElementById('logout-btn').addEventListener('click', function () {
        fetch('/logout')
            .then(() => {
                localStorage.removeItem('usn');
                window.location.href = '/';
            })
            .catch(error => console.error('Error logging out:', error));
    });
});

function viewJob(jobId) {
    window.location.href = `/job/${jobId}`;
}

function applyJob(jobId) {
    fetch('/api/apply_job', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: jobId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Applied successfully!');
                window.location.reload();
            } else {
                alert('Failed to apply.');
            }
        })
        .catch(error => console.error('Error applying for job:', error));
}

function withdrawJob(jobId) {
    fetch('/api/withdraw_application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: jobId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Application withdrawn.');
                window.location.reload();
            } else {
                alert('Failed to withdraw application.');
            }
        })
        .catch(error => console.error('Error withdrawing application:', error));
}

