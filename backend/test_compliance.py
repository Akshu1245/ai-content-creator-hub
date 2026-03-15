import asyncio
import sys
sys.path.insert(0, ".")

from app.services.compliance_scorer import (
    score_text, get_model_info
)

async def main():
    # Check model status
    info = get_model_info()
    print("=== MODEL STATUS ===")
    print(f"Model loaded: {info['model_loaded']}")
    print(f"Model path: {info['model_path']}")
    print(f"Files found: {info['files']}")
    print(f"Device: {info['device']}")
    print()
    
    # Test cases
    test_cases = [
        {
            "text": "Today we explore the top 5 AI tools "
                    "transforming business productivity in 2025.",
            "expected": "safe"
        },
        {
            "text": "How to hack into someone's account "
                    "and steal their data illegally.",
            "expected": "risky"
        },
        {
            "text": "This conspiracy theory reveals the "
                    "government is hiding dangerous fake news "
                    "from everyone.",
            "expected": "risky"
        },
        {
            "text": "Simple cooking tutorial: how to make "
                    "delicious biryani at home step by step.",
            "expected": "safe"
        },
        {
            "text": "Finance guide: best investment strategies "
                    "for beginners in the Indian stock market.",
            "expected": "safe"
        }
    ]
    
    print("=== COMPLIANCE SCORING TESTS ===\n")
    for i, case in enumerate(test_cases):
        result = await score_text(case["text"])
        status = "✅" if (
            (result["is_safe"] and case["expected"] == "safe") or
            (not result["is_safe"] and case["expected"] == "risky")
        ) else "❌"
        
        print(f"Test {i+1} {status}")
        print(f"Text: {case['text'][:60]}...")
        print(f"Score: {result['score']}/100")
        print(f"Verdict: {result['verdict']}")
        print(f"Provider: {result['provider']}")
        if result.get("risk_flags"):
            print(f"Flags: {[f['category'] for f in result['risk_flags']]}")
        print()

asyncio.run(main())
