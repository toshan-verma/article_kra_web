import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CardComponent from './CardComponent';

function App() {
  const [activeTab, setActiveTab] = useState('article_view');

  return (
    <div className="App">
      <h1>React Tabs with API Integration</h1>
      <div className="tabs">
        <button
          className={activeTab === 'article_view' ? 'active' : ''}
          onClick={() => setActiveTab('article_view')}
        >
          <b>Article</b>
        </button>
        <button
          className={activeTab === 'admin_view' ? 'active' : ''}
          onClick={() => setActiveTab('admin_view')}
        >
          <b>ADMIN</b>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'article_view' && <Article_view />}
        {activeTab === 'admin_view' && <Admin_view />}
      </div>
    </div>
  );
}

function Article_view() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3002/1.1/api/v1/articles')
      .then(response => {
        if (response?.data?.data.length > 0) {
          setArticles(response.data.data);
          console.log("articles---------------1")
          console.log(response.data.data)
          setLoading(false);
        } else {
          console.log("No articles found");
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching API:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      {/* Dynamically render the cards */}
      <div className="cards-container">
        {articles.map((card, index) => (
          <CardComponent
            key={index}
            image={card.article_image}
            name={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
}

function Admin_view() {
  // State to store the dropdown options
  const [categorySelectOptions, setSingleCategory] = useState([]);
  const [tagSelectOptions, setMultiTags] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    property: '',
    description: '',
    article_image: '',
    article_type: '',
    mediaUrl: '',
    hyperlink: '',
    category_id: '', // Single select
    tags: [], // Multi select (array)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetching the dropdown options from the API
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3002/1.1/api/v1/tags');
        const tags = await response.json();
        setMultiTags(tags?.data);
      } catch (err) {
        setError('Failed to fetch options');
      } finally {
        setLoading(false);
      }
    };

    const fetchcategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3002/1.1/api/v1/categories');
        const categories = await response.json();
        setSingleCategory(categories?.data);
      } catch (err) {
        setError('Failed to fetch options');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
    fetchcategories();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle changes for single select (dropdown)
    if (name === 'category_id') {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Handle changes for multi-select (checkboxes)
    if (name === 'tags') {
      const valueIndex = formData.tags.indexOf(value);
      let updatedOptions = [...formData.tags];

      if (checked) {
        updatedOptions.push(value); // If checked, add it
      } else {
        updatedOptions.splice(valueIndex, 1); // If unchecked, remove it
      }

      setFormData({
        ...formData,
        tags: updatedOptions,
      });
    }

    // Handle text input changes
    if (name !== 'tags' && name !== 'category_id') {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    formData.author_id = "6817b2f47d96a1ac441d880d";

    try {
      const response = await fetch('http://localhost:3002/1.1/api/v1/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const result = await response.json();
      setSuccess('Form submitted successfully!');
      console.log(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Article</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Ttitle:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="subTitle">Sub Title:</label>
          <input
            type="text"
            id="subTitle"
            name="subTitle"
            value={formData.subTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="property">property:</label>
          <input
            type="text"
            id="property"
            name="property"
            value={formData.property}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="article_image">article_image:</label>
          <input
            type="text"
            id="article_image"
            name="article_image"
            value={formData.article_image}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="article_type">article_type:</label>
          <input
            type="text"
            id="article_type"
            name="article_type"
            value={formData.article_type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="mediaUrl">mediaUrl:</label>
          <input
            type="text"
            id="mediaUrl"
            name="mediaUrl"
            value={formData.mediaUrl}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="hyperlink">hyperlink:</label>
          <input
            type="text"
            id="hyperlink"
            name="hyperlink"
            value={formData.hyperlink}
            onChange={handleChange}
            required
          />
        </div>

        {/* Single Select (Dropdown) */}
        <div>
          <label htmlFor="category_id">Category:</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">--Select--</option>
            {categorySelectOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Multi Select (Checkboxes) */}
        <div>
          <label><u>Tags:</u></label>
          <br />
          {tagSelectOptions.map((option) => (
            <label key={option._id}>
              <input
                type="checkbox"
                name="tags"
                value={option._id}
                onChange={handleChange}
                checked={formData.tags.includes(String(option._id))}
              />
              {option.name}
            </label>
          ))}
        </div>

        <div className="tab-content">
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
