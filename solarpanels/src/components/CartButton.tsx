import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchRequestInfo } from "../slices/solarpanelRequestSlice";
import cartIcon from "../resources/vector-50.svg";

function CartButton() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { requestInfo } = useAppSelector((state) => state.solarpanelRequest);
  const { isAuth } = useAppSelector((state) => state.auth);
  
  const panelsInRequest = requestInfo.panels_in_request ?? 0;
  const requestId = requestInfo.request_id;

  useEffect(() => {
      dispatch(fetchRequestInfo());
  }, [dispatch]);

  const isDisabled = panelsInRequest <= 0 || !isAuth;

  const handleClick = () => {
    if (requestId) {
      navigate(`/requests/${requestId}`);
    }
  };

  return (
    <button
      className={`cart-button ${isDisabled ? "disabled" : ""}`}
      disabled={isDisabled}
      onClick={handleClick}
    >
      <img src={cartIcon} alt="Корзина" style={{ width: 20, height: 20 }} />
      {panelsInRequest > 0 && (
        <span className="cart-badge">{panelsInRequest}</span>
      )}
    </button>
  );
}

export default CartButton;
