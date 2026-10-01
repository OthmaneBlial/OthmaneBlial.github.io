# Vulkan-like Rust subset

`silicon::vulkan_like` is a small compatibility-style layer over the supported
`silicon::api` renderer. It demonstrates familiar explicit-rendering concepts
without implementing Vulkan's loader, ABI, command formats, or conformance
requirements. Applications call this Rust module directly; a Vulkan program
cannot load SILICON as a Vulkan driver.

The subset provides one `Instance`, one software `PhysicalDevice`, and a
`LogicalDevice` with a fixed-size offscreen RGBA8 framebuffer. It supports
owned vertex, index, and uniform buffers; RGBA8 images; SPIR-V shader modules
and graphics pipelines; descriptor-like uniform and sampled-image bindings;
one clear render pass; indexed or non-indexed triangle draws; command
validation; and synchronous queue submission. Image bindings use the default
sampler. The renderer accepts only SILICON's documented SPIR-V graphics
subset.

It has no surfaces, swapchains, presentation, asynchronous queues, memory
allocator API, descriptor layouts, multiple render targets, compute pipeline,
or Vulkan binary compatibility. The output remains SILICON's CPU framebuffer.

Run the end-to-end indexed, textured triangle:

```sh
cargo run --release --example vulkan_like
```

The example writes `output/vulkan_like_triangle.png`. Its resources, pipeline,
descriptor-like bindings, render pass, draw, and submission all pass through
`silicon::vulkan_like`.
