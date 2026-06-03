import React from 'react';

const ActivityFeed = ({ items }) => {
    const defaultItems = [
        { color: 'skyblue', text: <><strong>Royal Enfield Classic 350</strong> was booked by Rahul Kumar</>, time: '2 minutes ago' },
        { color: 'blue', text: <><strong>NS 200</strong> returned successfully — condition verified</>, time: '15 minutes ago' },
        { color: 'orange', text: <>Booking <strong>#BK-1042</strong> status changed to <strong>Active</strong></>, time: '1 hour ago' },
        { color: 'skyblue', text: <><strong>New customer</strong> Priya Sharma registered</>, time: '2 hours ago' },
        { color: 'red', text: <><strong>GT 650</strong> scheduled for maintenance tomorrow</>, time: '3 hours ago' },
        { color: 'blue', text: <>Payment of <strong>₹4,500</strong> received for booking #BK-1038</>, time: '5 hours ago' },
    ];

    const feed = items || defaultItems;

    return (
        <div className="activity-feed">
            {feed.map((item, index) => (
                <div className="activity-item" key={index}>
                    <div className={`activity-dot activity-dot--${item.color}`}></div>
                    <div>
                        <div className="activity-text">{item.text}</div>
                        <div className="activity-time">{item.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityFeed;
