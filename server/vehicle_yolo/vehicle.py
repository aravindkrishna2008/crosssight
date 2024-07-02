from detect import run

class VehicleDetector():
    def __init__(self):
        self.weights = "./vehicle_yolo5.pt"
    
    def detect(self, source):
        x = run(self.weights, source)
        print(x)
        


if __name__ == "__main__":
    vehicle_detector = VehicleDetector()
    vehicle_detector.detect("./test_images/imtest18.jpg")
