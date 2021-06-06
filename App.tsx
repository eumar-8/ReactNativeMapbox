import React, {useCallback, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {lineString as makeLineString, LineString, Feature} from '@turf/helpers';
import {styles} from './style';
import {
  MAPBOX_API_KEY,
  INITIAL_CENTER_COORDINATES,
  INITIAL_ZOOM,
} from './constants';

MapboxGL.setAccessToken(MAPBOX_API_KEY);

type Point = [number, number];
type Points = Point[];

const App = (): JSX.Element => {
  const [shape, setShape] =
    useState<
      Feature<
        LineString,
        {
          [name: string]: any;
        }
      >
    >(null);
  const [points, setPoints] = useState<Points>([]);
  const [editMode, setEditMode] = useState(false);

  const addPoint = useCallback(
    evt => {
      if (!editMode) return;
      setPoints([...points, evt.geometry.coordinates]);
    },
    [editMode, points],
  );
  const renderAnnotation = (coordinates: Point) => {
    return (
      <MapboxGL.PointAnnotation
        key={`point-${coordinates[0]}-${coordinates[1]}`}
        id="pointAnnotation"
        coordinate={coordinates}>
        <View style={styles.annotation} />
      </MapboxGL.PointAnnotation>
    );
  };

  const drawShape = useCallback(() => {
    setEditMode(false);
    if (!points || points.length === 0) return;
    const lineString = makeLineString([...points, points[0]]);
    setShape(lineString);
  }, [points]);

  const startDrawing = useCallback(() => {
    setEditMode(true);
    setPoints([]);
    setShape(null);
  }, []);

  return (
    <View style={styles.containerMap}>
      <MapboxGL.MapView
        styleURL={MapboxGL.StyleURL.Street}
        zoomLevel={INITIAL_ZOOM}
        centerCoordinate={INITIAL_CENTER_COORDINATES}
        style={styles.mapViewContainer}
        onPress={evt => addPoint(evt)}>
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={INITIAL_CENTER_COORDINATES}
          animationMode={'flyTo'}
          animationDuration={0}></MapboxGL.Camera>
        {points.map(coordinates => renderAnnotation(coordinates))}
        {shape && (
          <MapboxGL.ShapeSource id="shapeSource" shape={shape}>
            <MapboxGL.LineLayer
              id="lineLayer"
              style={{lineWidth: 5, lineJoin: 'bevel', lineColor: '#ff0000'}}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
      {!editMode ? (
        <TouchableOpacity onPress={startDrawing} style={styles.buttonStart}>
          <Text style={styles.buttonText}>Start drawing</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={drawShape} style={styles.buttonStop}>
          <Text style={styles.buttonText}>Stop drawing</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default App;
