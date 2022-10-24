use bevy::{
    prelude::{App, ClearColor, Color},
    window::WindowDescriptor,
    DefaultPlugins,
};

pub const CLEAR: Color = Color::rgb(0.1, 0.1, 0.1);
pub const BLUE: Color = Color::rgb(0.1, 0.1, 0.9);
pub const RESOLUTION: f32 = 16.0 / 9.0;

fn main() {
    // Get the height through the parameter, if none is given, use 720p
    let height = std::env::args()
        .nth(1)
        .and_then(|s| s.parse::<u32>().ok())
        .unwrap_or(600);

    App::new()
        .insert_resource(ClearColor(BLUE))
        .insert_resource(WindowDescriptor {
            width: height as f32 * RESOLUTION,
            height: height as f32,
            title: "Bevy Game".to_string(),
            present_mode: bevy::window::PresentMode::AutoVsync,
            resizable: false,
            ..Default::default()
        })
        .add_plugins(DefaultPlugins)
        .run();

    println!("Height: {}", height);
}
