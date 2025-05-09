const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const NEXT_PUBLIC_JWT_AUTH_URL = process.env.NEXT_PUBLIC_JWT_AUTH_URL

// Auth endpoints
export async function loginUser(username, password) {
    console.log('Login request:', username, password);
    console.log('NEXT_PUBLIC_JWT_AUTH_URL:', NEXT_PUBLIC_JWT_AUTH_URL);

    const res = await fetch(`${NEXT_PUBLIC_JWT_AUTH_URL}/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();  // <--- This gets the actual body
      console.log('Login data:', data); // <--- This will show token and user info
      
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      return data;
}

export async function register(username, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  return response.json();
}

export async function logout(token) {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

// User endpoints
export async function getUserProfile(token) {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('response', response);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
  
    return response.json();
  }

export async function updateUserProfile(userId, data, token) {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Topics endpoints
export async function getTopics() {
  const response = await fetch(`${API_BASE_URL}/forum/`);
  return response.json();
}

export async function getQuestionsOfTopic(id) {
  const response = await fetch(`${API_BASE_URL}/topic?parent=${id}`);
  return response.json();
}

export async function getTopicDetails(id) {
    const response = await fetch(`${API_BASE_URL}/forum/${id}`);
  return response.json();
}

export async function getTopic(id) {
  const response = await fetch(`${API_BASE_URL}/topic/${id}`);
  return response.json();
}

export async function createTopic(title, content, token) {
  const response = await fetch(`${API_BASE_URL}/topic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return response.json();
}

export async function updateTopic(id, data, token) {
  const response = await fetch(`${API_BASE_URL}/topic/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteTopic(id, token) {
  const response = await fetch(`${API_BASE_URL}/topic/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

//Questions endpoints

export async function getQuestionDetails(questionId) {
  const response = await fetch(`${API_BASE_URL}/topic/${questionId}`);
  return response.json();
}

// Replies endpoints
export async function getRepliesforQuestions(questionId) {
  const response = await fetch(`${API_BASE_URL}/reply?parent=${questionId}`);
  return response.json();
}

export async function getLatestReply(id) {

    //get all questions of a topic
    const response = await fetch(`${API_BASE_URL}/topic?parent=${id}`);
    const questions = await response.json();
    console.log('Questions:', questions);
    // Process each question to get its latest reply

    const questionsWithReplies = await Promise.all(questions.map(async (question) => {
        const repliesResponse = await fetch(`${API_BASE_URL}/reply?parent=${question.id}`);
        const repliesData = await repliesResponse.json();
        // Sort replies by date to get the latest one
        if (repliesData && repliesData.length > 0) {
            const sortedReplies = repliesData.sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            console.log('Sorted replies:', sortedReplies);
            question.latest_reply = sortedReplies[0].content.rendered; // Add latest reply to question object
        } else {
            question.latest_reply = null;
        }
        return question;
    }));
    return questionsWithReplies;
}

export async function getReplyOfTopic(topicId) {
  const response = await fetch(`${API_BASE_URL}/reply?parent=${topicId}`);
  return response.json();
}

export async function createReply(topicId, content, token) {
  const response = await fetch(`${API_BASE_URL}/reply?parent=${topicId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return response.json();
}

export async function updateReply(replyId, content, token) {
  const response = await fetch(`${API_BASE_URL}/reply/${replyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return response.json();
}

export async function deleteReply(replyId, token) {
  const response = await fetch(`${API_BASE_URL}/reply/${replyId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

// Search endpoints
export async function searchTopics(query) {
  const response = await fetch(`${API_BASE_URL}/search/topics?q=${encodeURIComponent(query)}`);
  return response.json();
}

export async function searchUsers(query) {
  const response = await fetch(`${API_BASE_URL}/search/users?q=${encodeURIComponent(query)}`);
  return response.json();
}
