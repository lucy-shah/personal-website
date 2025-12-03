import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState } from 'react'


//opening drawer function
function Drawer({position, onClick, isOpen}) {
    //open drawer when open
    const zPosition = isOpen ? position[2] + 0.5 : position[2]
    return (
        <group>
            {/* Drawer box */}
            <mesh position={[position[0], position[1], zPosition]} onClick={onClick}>
                <boxGeometry args={[0.65, 0.3, 1.8]} />
                <meshStandardMaterial color="#B8956A" />
            </mesh>
            {/* Handle */}
      <mesh position={[position[0], position[1], zPosition + 0.95]}>
        <boxGeometry args={[0.3, 0.05, 0.1]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
    </group>
  )
}


function Laptop({ position }) {
    return (
    <group position={position}>
        {/* Laptop base (keyboard) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.3, 0.05, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
        {/* Laptop screen - angled back */}
      <mesh position={[0, 0.35, -0.25]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.3, 0.6, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
        {/* Screen display (lighter color for the "on" part) */}
      <mesh position={[0, 0.35, -0.22]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.01]} />
        <meshStandardMaterial color="#4A90E2" emissive="#4A90E2" emissiveIntensity={0.5} />
      </mesh>
        </group>
    )
}


function Desk() {
    return (
        <group>
        {/* Main desk surface */}
        <mesh position={[0, 1, 0]}>
            <boxGeometry args={[4, 0.1, 2]} />
            <meshStandardMaterial color="#D2B48C" />
        </mesh>
        
        {/* Desk legs - 4 corners */}
        <mesh position={[-1.8, 0.3, 0.8]}>
            <boxGeometry args={[0.1, 1.3, 0.1]} />
            <meshStandardMaterial color="#8B7355" />
        </mesh>
        <mesh position={[1.8, 0.3, 0.8]}>
            <boxGeometry args={[0.1, 1.3, 0.1]} />
            <meshStandardMaterial color="#8B7355" />
        </mesh>
        <mesh position={[-1.8, 0.3, -0.8]}>
            <boxGeometry args={[0.1, 1.3, 0.1]} />
            <meshStandardMaterial color="#8B7355" />
        </mesh>
        <mesh position={[1.8, 0.3, -0.8]}>
            <boxGeometry args={[0.1, 1.3, 0.1]} />
            <meshStandardMaterial color="#8B7355" />
        </mesh>
        
        {/* Drawer unit on the right side */}
        <mesh position={[1.4, 0.4, 0]}>
            <boxGeometry args={[0.7, 1.1, 1.9]} />
            <meshStandardMaterial color="#A0826D" />
        </mesh>
        
        {/* Drawer handles (3 drawers) - centered on front of drawer */}
        <mesh position={[1.4, 0.7, 1.0]}>
            <boxGeometry args={[0.3, 0.05, 0.1]} />
            <meshStandardMaterial color="#f1eeeeff" />
        </mesh>
        <mesh position={[1.4, 0.4, 1.0]}>
            <boxGeometry args={[0.3, 0.05, 0.1]} />
            <meshStandardMaterial color="#f1eeeeff" />
        </mesh>
        <mesh position={[1.4, 0.1, 1.0]}>
            <boxGeometry args={[0.3, 0.05, 0.1]} />
            <meshStandardMaterial color="#f1eeeeff" />
    </mesh>
        <Laptop position={[0, 1.1, -0.6]} />
        </group>

  )
}

function MainPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 3, 5] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        
        <Desk />
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default MainPage