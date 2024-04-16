import React from 'react';
import {Link} from 'react-router-dom';

const Forum = ({ forumName }) => {
    return (
        <div className="card my-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <h5 className="card-title">{forumName}</h5>
                <div className="mb-3">
                    <Link to={`/forums/${forumName}`} className="btn btn-primary">Take a Peek</Link>
                </div>
            </div>
        </div>
    );
};

export default Forum;
