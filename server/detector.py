from detect import run

class Detector():
    def __init__(self, weights):
        self.weights = weights
        self.annotations = None
    
    def detect(self, source):
        x = run(self.weights, source, device='mps')
        print(x)
        self.annotations = x
    
    def get_annotations(self):
        return self.annotations
    
    def getDistance(self, x, y, w, h):
        return 0
    

if __name__ == "__main__":
    vehicle_detector = Detector("./vehicle_yolo/vehicle_yolo5.pt")
    vehicle_detector.detect()
