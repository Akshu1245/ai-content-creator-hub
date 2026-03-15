import asyncio

from app.services.kieai_service import auto_select_model, generate_full_video_pipeline


async def test_model_selection():
    test_cases = [
        {
            "script": "Top 5 AI tools for Indian students",
            "niche": "Technology",
            "style": "educational",
            "quality": "balanced",
            "language": "hi-IN",
            "expected": "wan2.6-t2v-plus",
        },
        {
            "script": "Fashion trends 2025 runway looks",
            "niche": "Fashion",
            "style": "entertainment",
            "quality": "balanced",
            "language": "en",
            "expected": "runway-duration-5-generate",
        },
        {
            "script": "Premium luxury car commercial",
            "niche": "Automotive",
            "style": "cinematic",
            "quality": "premium",
            "language": "en",
            "expected": "veo3_quality",
        },
    ]

    print("\n=== Testing Kie.ai Model Selection ===")
    for i, case in enumerate(test_cases):
        model = auto_select_model(
            case["script"], case["niche"], case["style"], case["quality"], case["language"]
        )
        status = "PASS" if model["model"] == case["expected"] else "FAIL"
        print(f"\nTest {i+1}: {status}")
        print(f"  Script: {case['script'][:50]}...")
        print(f"  Expected: {case['expected']}")
        print(f"  Got: {model['model']}")
        print(f"  Reason: {model['reason']}")


async def test_full_pipeline():
    print("\n=== Testing Full Kie.ai Pipeline ===")

    result = await generate_full_video_pipeline(
        script="Learn Python programming in 5 easy steps. Start with basics and build projects.",
        niche="Technology",
        style="educational",
        quality="balanced",
        language="en-IN",
        platform="youtube",
    )

    print(f"Model selected: {result['model_selected']}")
    print(f"Reason: {result['model_reason']}")
    print(f"Clips generated: {result['successful_clips']}/{result['total_clips']}")
    print(f"Success: {result['generation_success']}")

    if result['generation_success']:
        print("\nGenerated clips:")
        for i, clip in enumerate(result['video_clips']):
            if clip.get('success'):
                print(f"  Clip {i+1}: {clip['video_url']}")


if __name__ == "__main__":
    asyncio.run(test_model_selection())
    asyncio.run(test_full_pipeline())
