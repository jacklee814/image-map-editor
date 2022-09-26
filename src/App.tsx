import { useReducer } from "react";
import toast, { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import omit from "lodash/fp/omit";
import Layout from "layouts/Layout";
import { Console, ImageMapEditor } from "components";
import type { Coordinate } from "types/coordinate";
import isCoordinatesOverlap from "utils/isCoordinatesOverlap";
import coordinateReducer, {
  COORDINATE_ACTIONS,
} from "reducers/coordinateReducer";

import "react-image-crop/dist/ReactCrop.css";

const elementOverlayNotify = () =>
  toast.error("The selections are overlapping.");

function App() {
  const [coordinates, dispatch] = useReducer(coordinateReducer, []);

  const handleDragStop = (currentCoordinate: Coordinate) => {
    if (isCoordinatesOverlap(coordinates, currentCoordinate)) {
      elementOverlayNotify();
      return;
    }
    dispatch({
      type: COORDINATE_ACTIONS.updated,
      payload: currentCoordinate,
    });
  };

  const handleResizeStop = (currentCoordinate: Coordinate) => {
    if (isCoordinatesOverlap(coordinates, currentCoordinate)) {
      elementOverlayNotify();
      return;
    }
    dispatch({
      type: COORDINATE_ACTIONS.updated,
      payload: currentCoordinate,
    });
  };

  const handleCropComplete = ({
    x,
    y,
    width,
    height,
  }: Omit<Coordinate, "id">) => {
    if (width === 0 || height === 0) return;

    const newCoordinate = {
      id: uuidv4(),
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    };

    if (isCoordinatesOverlap(coordinates, newCoordinate)) {
      elementOverlayNotify();
      return;
    }

    dispatch({
      type: COORDINATE_ACTIONS.added,
      payload: newCoordinate,
    });
  };

  const handleRemoveCoordinate = (coordinate: Coordinate) => {
    dispatch({
      type: COORDINATE_ACTIONS.removed,
      payload: coordinate,
    });
  };

  return (
    <Layout>
      <ImageMapEditor
        coordinates={coordinates}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onRemoveCoordinate={handleRemoveCoordinate}
        onCropComplete={handleCropComplete}
      />
      <Console>
        {coordinates.length > 0
          ? JSON.stringify(coordinates.map(omit("id")), null, 2)
          : null}
      </Console>
      <Toaster />
    </Layout>
  );
}

export default App;
