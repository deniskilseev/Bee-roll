import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Forum from './components/Forum';

const ForumList = () => {
   const [forumList, setForumList] = useState([]);

    useEffect(() => {
        const fetchForumList = async () => {
            try {
                const response = await axios.get('http://localhost:3000/forums/');
                const fetchedForums = response.data.publicForums;
                console.log(fetchedForums);
                setForumList(fetchedForums);
            } catch (error) {
                console.error('Error fetching forum:', error);
            }
        };

        fetchForumList();
    });

    return (
        <div className="container mt-5">
            <h1>List of Public Forums</h1>
            {/*Display all of the fetched forums*/}
            {forumList.map((forum) => (
                <Forum forumName={forum.forumTitle}/>
            ))}

        </div>
    );
};

export default ForumList;
