import { useEffect } from "react";
import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSolarPanelsInRequest } from "../slices/dataSlice";
import { getSolarPanelsRequestInfo } from "../getData";
import cartIcon from "../resources/vector-50.svg";

function CartButton() {
const dispatch = useAppDispatch();

const panelsInRequest = useAppSelector(
(state) => state.ourSolarPanels?.solarPanelsInRequest ?? 0
);

useEffect(() => {

getSolarPanelsRequestInfo()
  .then((info) => {
      console.log("Загружена информация о корзине:", info);
      dispatch(setSolarPanelsInRequest(info.panels_in_request));
  })
  .catch(() => {
      dispatch(setSolarPanelsInRequest(0));
  });


}, []);

const isDisabled = panelsInRequest <= 0;

return (
  <Button
    as={Link as any}
    to="/cart"
    variant={isDisabled ? "secondary" : "warning"}
    disabled={isDisabled}
    className="cart-button-component"
    >
      <img
      src={cartIcon}
      alt="Корзина"
      style={{ width: 20, height: 20, marginRight: 8 }}
      />
        {panelsInRequest > 0 && (
        <Badge bg="danger" className="ms-1">
        {panelsInRequest}
        </Badge>
        )}
        <span className="visually-hidden">
            {panelsInRequest}
        </span>
  </Button>
  );
}

export default CartButton;