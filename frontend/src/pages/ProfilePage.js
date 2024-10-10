import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout, updateUserProfile } from '../actions/userActions';
import { fetchMyOrders } from '../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';

function ProfileScreen(props) {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const dispatch = useDispatch();

  const userSigninState = useSelector(state => state.userSignin);
  const { userInfo } = userSigninState;

  const handleLogout = () => {
    dispatch(logout());
    props.history.push("/signin");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ userId: userInfo._id, email: userEmail, name: userName, password: userPassword }));
  }

  const userUpdateState = useSelector(state => state.userUpdate);
  const { loading: loadingUpdate, success: updateSuccess, error: updateError } = userUpdateState;

  const myOrderListState = useSelector(state => state.myOrderList);
  const { loading: loadingOrders, orders, error: errorOrders } = myOrderListState;

  useEffect(() => {
    if (userInfo) {
      setUserEmail(userInfo.email);
      setUserName(userInfo.name);
      setUserPassword(userInfo.password);
    }
    dispatch(fetchMyOrders());
  }, [userInfo, dispatch]);

  return (
    <div className="profile">
      <div className="profile-info">
        <div className="form">
          <form onSubmit={submitHandler}>
            <ul className="form-container">
              <li>
                <h2>User Profile</h2>
              </li>
              <li>
                {loadingUpdate && <div>Loading...</div>}
                {updateError && <div>{updateError}</div>}
                {updateSuccess && <div>Profile Saved Successfully.</div>}
              </li>
              <li>
                <label htmlFor="name">Name</label>
                <input value={userName} type="text" name="name" id="name" onChange={(e) => setUserName(e.target.value)} />
              </li>
              <li>
                <label htmlFor="email">Email</label>
                <input value={userEmail} type="email" name="email" id="email" onChange={(e) => setUserEmail(e.target.value)} />
              </li>
              <li>
                <label htmlFor="password">Password</label>
                <input value={userPassword} type="password" id="password" name="password" onChange={(e) => setUserPassword(e.target.value)} />
              </li>
              <li>
                <button type="submit" className="button primary">Update</button>
              </li>
              <li>
                <button type="button" onClick={handleLogout} className="button secondary full-width">Logout</button>
              </li>
            </ul>
          </form>
        </div>
      </div>
      <div className="profile-orders content-margined">
        {loadingOrders ? <div>Loading...</div> :
          errorOrders ? <div>{errorOrders}</div> :
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.isPaid ? 'Yes' : 'No'}</td>
                    <td>
                      <Link to={"/order/" + order._id}>DETAILS</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  );
}

export default ProfileScreen;
